import type { RadioOption } from "@/shared/components/CustomRadioGroup";
import type { EventStatus } from "../types/addEvent";

export const activityStatusList : RadioOption<EventStatus>[] = [
  { id: "ongoing", value: "ongoing", label: "Ongoing" },
  { id: "done", value: "done", label: "Done" }
];
