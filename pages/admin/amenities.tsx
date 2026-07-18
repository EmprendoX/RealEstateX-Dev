import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  count: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      count: development.amenities.length,
    },
  };
};

export default function AdminAmenitiesPage({ readOnly, count }: Props) {
  return (
    <AdminLayout title="Amenidades" readOnly={readOnly}>
      <AdminPlaceholder
        title="Amenidades del proyecto"
        count={count}
        countLabel="amenidades configuradas"
        jsonPath="data/development.json"
        jsonKey="amenities[]"
        publicAnchor="/#amenidades"
        publicLabel="Ver sección Amenidades"
        extra={
          <p>
            Íconos disponibles: <code className="text-xs bg-neutral-100 px-1 rounded">waves</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">umbrella</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">flame</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">utensils</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">laptop</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">sun</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">anchor</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">wine</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">dumbbell</code>,{" "}
            <code className="text-xs bg-neutral-100 px-1 rounded">concierge-bell</code>.
          </p>
        }
      />
    </AdminLayout>
  );
}
