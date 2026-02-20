// ─── Validation Schema ────────────────────────────────────────────────────────
import * as Yup from "yup";


export const trailerValidationSchema = Yup.object().shape({
  trailerNumber: Yup.string().required("Trailer number is required"),
  trailerType: Yup.string().nullable(),
  length: Yup.string().nullable(),
  height: Yup.string().nullable(),
  terminal: Yup.string().required("Terminal is required"),
  carrier: Yup.string().required("Carrier is required"),
  vin: Yup.string().nullable(),
  licenseNumber: Yup.string().nullable(),
  licenseState: Yup.string().nullable(),
  licenseExp: Yup.string().nullable(),
  make: Yup.string().nullable(),
  model: Yup.string().nullable(),
  year: Yup.string().nullable(),
  inspectionExp: Yup.string().nullable(),
  registrationNumber: Yup.string().nullable(),
  contractType: Yup.string().nullable(),
  inServiceFrom: Yup.string().nullable(),
  sourceReference: Yup.string().nullable(),
  integrationId: Yup.string().nullable(),
  monthlyCost: Yup.string().nullable(),
  trailerStatus: Yup.string().nullable(),
  notes: Yup.string().nullable(),
  // Payable To
  payableName: Yup.string().nullable(),
  einNumber: Yup.string().nullable(),
  payableEmail: Yup.string().nullable(),
  payableAddress: Yup.string().nullable(),
  payableCity: Yup.string().nullable(),
  payableState: Yup.string().nullable(),
  payableZipCode: Yup.string().nullable(),
  // Lease
  isLeased: Yup.boolean(),
  leaseStartDate: Yup.string().nullable(),
  leaseExpiryDate: Yup.string().nullable(),
  leaseCompanyVendor: Yup.string().when("isLeased", {
    is: true,
    then: (s) => s.required("Lease company vendor is required"),
    otherwise: (s) => s.nullable(),
  }),
  // Flags
  doNotUse: Yup.boolean(),
  onHold: Yup.boolean(),
  status: Yup.boolean(),
});