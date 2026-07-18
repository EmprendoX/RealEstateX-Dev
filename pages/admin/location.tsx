import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  distances: number;
  city: string;
  state: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      distances: development.location.distances.length,
      city: development.location.city,
      state: development.location.state,
    },
  };
};

export default function AdminLocationPage({ readOnly, distances, city, state }: Props) {
  return (
    <AdminLayout title="Ubicación" readOnly={readOnly}>
      <AdminPlaceholder
        title="Ubicación del proyecto"
        count={distances}
        countLabel="lugares clave configurados"
        jsonPath="data/development.json"
        jsonKey="location"
        publicAnchor="/#ubicacion"
        publicLabel="Ver sección Ubicación"
        extra={
          <p>
            Ubicación actual: <b>{city}, {state}</b>. Cambio de coordenadas mueve el marcador del mapa
            (OpenStreetMap embebido, sin API key).
          </p>
        }
      />
    </AdminLayout>
  );
}
