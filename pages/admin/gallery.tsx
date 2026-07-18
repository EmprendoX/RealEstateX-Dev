import type { GetServerSideProps } from "next";
import path from "path";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  count: number;
  readOnly: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return { props: { count: development.galleryImages.length, readOnly: !canWrite(devPath) } };
};

export default function AdminGalleryPage({ count, readOnly }: Props) {
  return (
    <AdminLayout title="Galería" readOnly={readOnly}>
      <AdminPlaceholder
        title="Galería de imágenes"
        count={count}
        countLabel="imágenes en la galería principal"
        jsonPath="data/development.json"
        jsonKey="galleryImages[]"
        publicAnchor="/#galeria"
        publicLabel="Ver sección Galería"
        extra={
          <p>
            Las URLs de la galería también son editables desde{" "}
            <Link href="/admin/development" className="text-neutral-900 underline hover:no-underline">
              Desarrollo → Galería
            </Link>
            .
          </p>
        }
      />
    </AdminLayout>
  );
}
