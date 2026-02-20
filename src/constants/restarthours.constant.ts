interface RestartHours {
  label: string;
  code: string;
  value: string;
}

export const RESTART_HOURS: RestartHours[] = [
  { label: "24 Hour", code: "24_RS", value: "24" },
  { label: "34 Hour", code: "34_RS", value: "34" },
  { label: "None", code: "NO_RS", value: "0" },
];
