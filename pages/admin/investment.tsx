import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  adr: number;
  occ: number;
  app: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      adr: development.investment.averageDailyRateUSD,
      occ: development.investment.occupancyPercent,
      app: development.investment.annualAppreciationPercent,
    },
  };
};

export default function AdminInvestmentPage({ readOnly, adr, occ, app }: Props) {
  return (
    <AdminLayout title="Inversión" readOnly={readOnly}>
      <AdminPlaceholder
        title="Supuestos de inversión"
        jsonPath="data/development.json"
        jsonKey="investment"
        publicAnchor="/#inversion"
        publicLabel="Ver sección Inversión"
        extra={
          <p>
            Escenario base actual: ADR <b>${adr}</b> · ocupación <b>{occ}%</b> · plusvalía <b>{app}% anual</b>.
          </p>
        }
      />
    </AdminLayout>
  );
}
