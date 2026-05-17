import AdminLayout from "@/components/admin/AdminLayout";
import ConfigForm from "@/components/admin/ConfigForm";

export default function ConfigPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Configuración del Sitio
        </h1>
        <p className="text-gray-600 mb-8">
          Edita la configuración general del sitio, datos del broker y automatizaciones.
        </p>
        <ConfigForm />
      </div>
    </AdminLayout>
  );
}


