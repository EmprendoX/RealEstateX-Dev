/**
 * Atomic JSON writes for the admin panel.
 *
 * Only intended to run in dev / self-hosted deployments where the process
 * has write access to the repo. On Netlify / Vercel the filesystem is
 * read-only at runtime — writes will fail with EROFS or EACCES and we
 * surface that as a friendly error instead of a stack trace.
 *
 * Every write:
 *   1. serializes the object to JSON (2-space pretty)
 *   2. writes to a temp sibling (foo.json.tmp-<pid>)
 *   3. fsync + atomic rename over the target
 *   4. rotates a backup copy in .backups/ (keeps the last KEEP_BACKUPS)
 */

import fs from "fs";
import path from "path";

const KEEP_BACKUPS = 10;

export interface WriteResult {
  ok: true;
  bytes: number;
  backup?: string;
}

export interface WriteError {
  ok: false;
  code: "READONLY_FS" | "PERMISSION" | "PARENT_MISSING" | "UNKNOWN";
  message: string;
}

export function writeJsonAtomic(
  absPath: string,
  data: unknown
): WriteResult | WriteError {
  const dir = path.dirname(absPath);
  if (!fs.existsSync(dir)) {
    return {
      ok: false,
      code: "PARENT_MISSING",
      message: `Parent directory does not exist: ${dir}`,
    };
  }

  const serialized = JSON.stringify(data, null, 2) + "\n";
  const tmpPath = `${absPath}.tmp-${process.pid}`;

  try {
    // Rotate a backup of the current file (if any) before we touch it.
    let backupPath: string | undefined;
    if (fs.existsSync(absPath)) {
      const backupDir = path.join(dir, ".backups");
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      backupPath = path.join(backupDir, `${path.basename(absPath)}.${ts}.bak`);
      fs.copyFileSync(absPath, backupPath);
      pruneBackups(backupDir, path.basename(absPath));
    }

    const fd = fs.openSync(tmpPath, "w");
    try {
      fs.writeSync(fd, serialized);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(tmpPath, absPath);

    return { ok: true, bytes: Buffer.byteLength(serialized), backup: backupPath };
  } catch (err: any) {
    // clean up the temp file if it was left behind
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {
      // best-effort
    }
    if (err && (err.code === "EROFS" || err.code === "EACCES")) {
      return {
        ok: false,
        code: err.code === "EROFS" ? "READONLY_FS" : "PERMISSION",
        message:
          err.code === "EROFS"
            ? "El sistema de archivos es de sólo lectura. El admin sólo escribe en dev local o en un host self-managed con permisos de escritura."
            : "Permisos insuficientes para escribir el archivo.",
      };
    }
    return {
      ok: false,
      code: "UNKNOWN",
      message: `Write failed: ${err?.message || String(err)}`,
    };
  }
}

function pruneBackups(backupDir: string, targetName: string) {
  const prefix = `${targetName}.`;
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".bak"))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(backupDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.time - a.time);

  for (const stale of files.slice(KEEP_BACKUPS)) {
    try {
      fs.unlinkSync(path.join(backupDir, stale.name));
    } catch {
      // best-effort
    }
  }
}

/**
 * Detects whether the filesystem is writable at the given path.
 * Used by admin pages to show a "read-only mode" banner without
 * attempting a real write.
 */
export function canWrite(absPath: string): boolean {
  try {
    fs.accessSync(absPath, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}
