import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  companyName: string;
  founded: number | null;
  projects: number | null;
  units: number | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      companyName: development.developer.name,
      founded: development.developer.founded ?? null,
      projects: development.developer.projectsDelivered ?? null,
      units: development.developer.totalUnitsDelivered ?? null,
    },
  };
};

export default function AdminDeveloperPage({ readOnly, companyName, founded, projects, units }: Props) {
  return (
    <AdminLayout title="Desarrolladora" readOnly={readOnly}>
      <AdminPlaceholder
        title="Empresa desarrolladora"
        jsonPath="data/development.json"
        jsonKey="developer"
        publicAnchor="/#desarrollador"
        publicLabel="Ver sección Desarrolladora"
        extra={
          <p>
            <b>{companyName}</b>
            {founded && <> · fundada {founded}</>}
            {projects && <> · {projects} proyectos entregados</>}
            {units && <> · {units} unidades escrituradas</>}
            .
          </p>
        }
      />
    </AdminLayout>
  );
}
