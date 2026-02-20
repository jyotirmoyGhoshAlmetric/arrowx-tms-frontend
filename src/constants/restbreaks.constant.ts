interface RestBreaks {
  label: string;
  code: string;
}

export const REST_BREAKS_REQUIRED: RestBreaks[] = [
  { label: "30 Min", code: "30_RB" },
  { label: "None", code: "NO_RB" },
];
