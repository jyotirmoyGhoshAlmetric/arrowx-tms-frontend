interface CycleTypes {
  label: string;
  code: string;
  hrs: string;
  days: string;
  isActive: boolean;
}

export const CYCLE_TYPES: CycleTypes[] = [
  {
    label: "USA 60 hours / 7 days (Interstate)",
    code: "USA_60_7",
    hrs: "60",
    days: "7",
    isActive: true,
  },
  {
    label: "USA 70 hours / 8 days (Interstate)",
    code: "USA_70_8",
    hrs: "70",
    days: "8",
    isActive: true,
  },
  // { label: "Alaska 70 hours / 7 days (Intrastate)", code: "ALK_70_7", hrs: "70", days: "7", isActive: true },
  // { label: "Alaska 80 hours / 8 days (Intrastate)", code: "ALK_80_8", hrs: "80", days: "8", isActive: true },
  // { label: "California 80 hours / 8 days (Intrastate)", code: "CAL_80_8", hrs: "80", days: "8", isActive: true },
  // { label: "Florida 70 hours / 7 days (Intrastate)", code: "FL_70_7", hrs: "70", days: "7", isActive: true },
  // { label: "Florida 80 hours / 8 days (Intrastate)", code: "FL_80_8", hrs: "80", days: "8", isActive: true },
  // { label: "Oregon 70 hours / 7 days (Intrastate)", code: "OR_70_7", hrs: "70", days: "7", isActive: true },
  // { label: "Oregon 80 hours / 8 days (Intrastate)", code: "OR_80_8", hrs: "80", days: "8", isActive: true },
  // { label: "Texas 70 hours / 7 days (Intrastate)", code: "TXS_70_7", hrs: "70", days: "7", isActive: true },
  // { label: "Wisconsin 70 hours / 7 days (Intrastate)", code: "WI_70_7", hrs: "70", days: "7", isActive: true },
  // { label: "Wisconsin 80 hours / 8 days (Intrastate)", code: "WI_80_8", hrs: "80", days: "8", isActive: true },
];
