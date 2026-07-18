import type { GetServerSideProps } from "next";
import path from "path";
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
  return { props: { count: development.models.length, readOnly: !canWrite(devPath) } };
};

export default function AdminModelsPage({ count, readOnly }: Props) {
  return (
    <AdminLayout title="Modelos" readOnly={readOnly}>
      <AdminPlaceholder
        title="Modelos (tipologías)"
        count={count}
        countLabel="modelos configurados"
        jsonPath="data/development.json"
        jsonKey="models[]"
        publicAnchor="/#modelos"
        publicLabel="Ver sección Modelos"
      />
    </AdminLayout>
  );
}
