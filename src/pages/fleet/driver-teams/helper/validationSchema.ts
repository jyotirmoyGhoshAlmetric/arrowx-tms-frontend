import * as Yup from "yup";

// ─── Validation Schema ────────────────────────────────────────────────────────

export const driverTeamValidationSchema = Yup.object().shape({
  carrier: Yup.string().required("Carrier is required"),
  firstDriver: Yup.string().required("First driver is required"),
  secondDriver: Yup.string().required("Second driver is required"),
});
