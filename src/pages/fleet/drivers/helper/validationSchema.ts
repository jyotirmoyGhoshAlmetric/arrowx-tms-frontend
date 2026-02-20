import * as Yup from "yup";

// Step 1 - Driver Details
export const driverDetailsValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .max(50, "First name is too long"),
  middleName: Yup.string().max(50, "Middle name is too long").nullable(),
  lastName: Yup.string()
    .required("Last name is required")
    .max(50, "Last name is too long"),
  nickName: Yup.string().max(50, "Nick name is too long").nullable(),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  driverType: Yup.string().required("Driver type is required"),
  taxForm: Yup.string().required("Tax form is required"),
  pin: Yup.string()
    .required("PIN is required")
    .min(4, "PIN must be at least 4 digits")
    .max(6, "PIN must be at most 6 digits"),
  confirmPassword: Yup.string()
    .required("Confirm PIN is required")
    .oneOf([Yup.ref("pin")], "PINs must match"),
  licenseNumber: Yup.string()
    .required("License number is required")
    .min(4, "License number is too short"),
  licenseCountry: Yup.string().required("License country is required"),
  licenseState: Yup.string().required("License state/province is required"),
  licenseExpiration: Yup.string().required("License expiration date is required"),
  hireDate: Yup.string().required("Hire date is required"),
});

// Step 2 - Contact Info
export const contactInfoValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  cellCountryCode: Yup.string().required("Country code is required"),
  cell: Yup.string()
    .required("Phone number is required")
    .test("phone-validation", "Phone number must be valid", function (value) {
      if (!value) return false;
      const cleaned = value.replace(/\D/g, "");
      return cleaned.length >= 10 && cleaned.length <= 15;
    }),
  note: Yup.string().max(500, "Notes must be less than 500 characters").nullable(),
});

// Step 3 - Rate Card (all optional)
export const rateCardValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

// Step 4 - More Details
export const moreDetailsValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  homeTerminalTimezone: Yup.string().required("Home terminal timezone is required"),
  cycleType: Yup.string().required("Cycle type is required"),
  cargoType: Yup.string().required("Cargo type is required"),
  restartHours: Yup.string().required("Restart hours is required"),
  restBreakRequired: Yup.string().required("Rest break requirement is required"),
});