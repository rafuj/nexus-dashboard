import { Switch } from "@/shared/components/ui/switch";

export const MaintenanceMode = () => {

  return (
    <div className="px-3 py-2.5 bg-white border border-border rounded-[10px] mb-4 flex justify-between items-center gap-4">
      <div className="w-0 grow">
        <h5 className="font-medium text-sm">Maintenance Mode</h5>
        <div className="text-xs">If enabled, the cabinet will pause its notifications.</div>
      </div>
      <Switch />
    </div>
  );

};