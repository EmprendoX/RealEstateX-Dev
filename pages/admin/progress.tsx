import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  count: number;
  completed: number;
  inProgress: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      count: development.construction.length,
      completed: development.construction.filter((c) => c.status === "completed").length,
      inProgress: development.construction.filter((c) => c.status === "in_progress").length,
    },
  };
};

export default function AdminProgressPage({ readOnly, count, completed, inProgress }: Props) {
  return (
    <AdminLayout title="Avance de obra" readOnly={readOnly}>
      <AdminPlaceholder
        title="Hitos de construcción"
        count={count}
        countLabel="hitos configurados"
        jsonPath="data/development.json"
        jsonKey="construction[]"
        publicAnchor="/#avance"
        publicLabel="Ver sección Avance de obra"
        extra={
          <p>
            Estado actual: <b>{completed}</b> completados, <b>{inProgress}</b> en progreso, <b>{count - completed - inProgress}</b> próximos.
          </p>
        }
      />
    </AdminLayout>
  );
}
