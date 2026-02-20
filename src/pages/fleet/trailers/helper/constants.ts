// ─── Constants ───────────────────────────────────────────────────────────────

export const TRAILER_FORM_STEPS = [
  { id: 1, title: "Trailer Details" },
  { id: 2, title: "Payable To" },
  { id: 3, title: "Lease & Sold" },
];

export const TRAILER_TYPE_OPTIONS = [
  { value: "van", label: "Van" },
  { value: "flatbed", label: "Flatbed" },
  { value: "reefer", label: "Reefer" },
  { value: "step_deck", label: "Step Deck" },
  { value: "lowboy", label: "Lowboy" },
  { value: "tanker", label: "Tanker" },
  { value: "dry_bulk", label: "Dry Bulk" },
  { value: "car_carrier", label: "Car Carrier" },
  { value: "other", label: "Other" },
];

export const TRAILER_LENGTH_OPTIONS = [
  { value: "48", label: "48" },
  { value: "53", label: "53" },
  { value: "40", label: "40" },
  { value: "45", label: "45" },
];

export const CONTRACT_TYPE_OPTIONS = [
  { value: "owner_operator", label: "Owner Operator" },
  { value: "company", label: "Company" },
  { value: "lease", label: "Lease" },
];

export const TRAILER_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "in_use", label: "In Use" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of Service" },
];

export const TERMINAL_OPTIONS = [
  { value: "default", label: "Default" },
  // TODO: populate from API
];

export const CARRIER_OPTIONS = [
  { value: "apple_freight", label: "APPLE FREIGHT INC" },
  // TODO: populate from API
];

export const LEASE_VENDOR_OPTIONS = [
  { value: "vendor1", label: "Vendor 1" },
  // TODO: populate from API
];

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export const VEHICLE_CLASS_ID_OPTIONS = [
  { value: "A", label: "Class A" },
  { value: "B", label: "Class B" },
  { value: "C", label: "Class C" },
];

export const VEHICLE_TAX_TYPE_OPTIONS = [
  { value: "not_1099", label: "Not a 1099 Vendor" },
  { value: "dividend", label: "Dividend" },
  { value: "interest", label: "Interest" },
  { value: "miscellaneous", label: "Miscellaneous" },
  { value: "nonemployee", label: "Nonemployee Compensation" },
];
