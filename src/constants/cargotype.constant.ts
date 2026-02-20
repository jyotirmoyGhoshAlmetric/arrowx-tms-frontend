interface CargoTypes {
  code: string;
  label: string;
}

export const CARGO_TYPES: CargoTypes[] = [
  { code: "PTY", label: "Property (Truck)" },
  { code: "PAS", label: "Passenger (Bus)" },
  { code: "ONG", label: "Oil and Gas" },
];
