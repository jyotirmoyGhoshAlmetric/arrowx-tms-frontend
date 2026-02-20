import * as Yup from "yup";

// ─── Validation Schema ────────────────────────────────────────────────────────

export const fuelCardValidationSchema = Yup.object().shape({
  carrier: Yup.string().nullable(),
  driver: Yup.string().nullable(),
  fuelCardType: Yup.string().nullable(),
  cardNumber: Yup.string().nullable(),
  isDeductible: Yup.boolean(),
});
