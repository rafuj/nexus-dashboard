import type { RadioOption } from "@/shared/components/CustomRadioGroup";
import type { ActivityStatus } from "../types/addActivity";

export const activityStatusList : RadioOption<ActivityStatus>[] = [
  { id: "ongoing", value: "ongoing", label: "Ongoing" },
  { id: "done", value: "done", label: "Done" }
];
