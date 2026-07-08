import AdminLayout from "@/components/admin/AdminLayout";
import ConfigForm from "@/components/admin/ConfigForm";

export default function ConfigPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Site Settings
        </h1>
        <p className="text-gray-600 mb-8">
          Edit the general site settings, broker details and automations.
        </p>
        <ConfigForm />
      </div>
    </AdminLayout>
  );
}


