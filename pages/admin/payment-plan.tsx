import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { canWrite } from "@/utils/adminFileWriter";
import { development } from "@/data/development";

interface Props {
  readOnly: boolean;
  downPayment: number;
  installments: number;
  onDelivery: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  return {
    props: {
      readOnly: !canWrite(devPath),
      downPayment: development.paymentPlan.downPayment.percent,
      installments: development.paymentPlan.installments.count,
      onDelivery: development.paymentPlan.onDelivery.percent,
    },
  };
};

export default function AdminPaymentPlanPage({ readOnly, downPayment, installments, onDelivery }: Props) {
  return (
    <AdminLayout title="Plan de pagos" readOnly={readOnly}>
      <AdminPlaceholder
        title="Plan de pagos preventa"
        jsonPath="data/development.json"
        jsonKey="paymentPlan"
        publicAnchor="/#plan-de-pagos"
        publicLabel="Ver sección Plan de pagos"
        extra={
          <p>
            Configuración vigente: enganche <b>{downPayment}%</b> · mensualidades <b>{installments}</b> · contra entrega <b>{onDelivery}%</b>.
          </p>
        }
      />
    </AdminLayout>
  );
}
