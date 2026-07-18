import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  highlights: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      highlights: development.concept.highlights.length,
    },
  };
};

export default function AdminConceptPage({ readOnly, highlights }: Props) {
  return (
    <AdminLayout title="Concepto" readOnly={readOnly}>
      <AdminPlaceholder
        title="Concepto del proyecto"
        count={highlights}
        countLabel="highlights configurados"
        jsonPath="data/development.json"
        jsonKey="concept"
        publicAnchor="/#concepto"
        publicLabel="Ver sección Concepto"
      />
    </AdminLayout>
  );
}
