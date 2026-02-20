import React, { useMemo, useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import InputGroup from "@/components/ui/InputGroup";
import { toast } from "react-toastify";
import {
  driverDetailsValidationSchema,
  contactInfoValidationSchema,
  rateCardValidationSchema,
  moreDetailsValidationSchema,
} from "./helper/validationSchema";
import {
  CELL_COUNTRY_CODES,
  COUNTRY_OPTIONS,
  DRIVER_FORM_STEPS,
  US_STATES,
  CANADA_PROVINCES,
  MEXICO_STATES,
  DRIVER_TYPE_OPTIONS,
  TAX_FORM_OPTIONS,
  ROUTE_TYPE_OPTIONS,
  PAY_METHOD_OPTIONS,
  CLASS_ID_OPTIONS,
  TAX_TYPE_OPTIONS,
  ENDORSEMENT_OPTIONS,
  TERMINATION_REASON_CODES,

} from "./helper/constants";
import { TIMEZONE_OPTIONS } from "@/constants/timezone.constant";
import { RESTART_HOURS } from "@/constants/restarthours.constant";
import { CYCLE_TYPES } from "@/constants/cycletype.constant";
import { REST_BREAKS_REQUIRED } from "@/constants/restbreaks.constant";
import { CARGO_TYPES } from "@/constants/cargotype.constant";


type ModalMode = "add" | "edit" | "view";

// Get validation schema based on current step
const getCurrentSchema = (stepNumber: number) => {
  switch (stepNumber) {
    case 0:
      return driverDetailsValidationSchema;
    case 1:
      return contactInfoValidationSchema;
    case 2:
      return rateCardValidationSchema;
    case 3:
      return moreDetailsValidationSchema;
    default:
      return driverDetailsValidationSchema;
  }
};

const Drivers: React.FC = () => {
  // State management
  const [stepNumber, setStepNumber] = useState(0);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [showTerminationReasonModal, setShowTerminationReasonModal] = useState(false);
  const [terminationCodeForm, setTerminationCodeForm] = useState({ code: "", description: "" });

  // Form setup
  const {
    register,
    control,
    watch,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    trigger,
  } = useForm({
    resolver: yupResolver(getCurrentSchema(stepNumber)) as any,
    mode: "onBlur",
    defaultValues: {
      // Step 1 - Driver Details
      freezePayDate: "",
      freezePayReason: "",
      firstName: "",
      middleName: "",
      lastName: "",
      nickName: "",
      email: "",
      driverCompanyId: "",
      integrationId: "",
      driverType: "",
      taxForm: "",
      routeType: "",
      dbaName: "",
      freezePay: false,
      extraPay: false,
      perDiem: false,
      terminated: false,
      terminationDate: new Date().toISOString().split("T")[0],
      terminationReasonCode: "",
      terminationReason: "",
      licenseNumber: "",
      licenseExpiration: "",
      licenseCountry: "US",
      licenseState: "",
      hireDate: new Date().toISOString().split("T")[0],
      pin: "",
      confirmPassword: "",
      isLogRocketEnabled: false,
      // Step 2 - Contact Info
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      cellCountryCode: "US",
      cell: "",
      phone: "",
      emergencyPhone: "",
      emergencyContact: "",
      ssn: "",
      einNumber: "",
      homeCity: "",
      homeState: "",
      note: "",
      // Step 3 - Rate Card
      mileageRate: "",
      emptyMileageRate: "",
      layoverRate: "",
      layoverPercentage: "",
      detentionRate: "",
      detentionPercentage: "",
      otherFlat: "",
      otherPercentage: "",
      hourlyRate: "",
      overTimeRate8: "",
      overTimeRate10: "",
      weeklyHourlyRate: "",
      weeklyOvertimeRate40: "",
      weeklyOvertimeRate80: "",
      perStopPay: "",
      afterStop: "",
      allStops: false,
      invoicePercentage: "",
      fuelSurcharge: "",
      dailyRate: "",
      payMethod: "none",
      teamMileageRate: "",
      teamEmptyMileageRate: "",
      perStopPayTeam: "",
      afterStopTeam: "",
      allStopsTeam: false,
      // Step 4 - More Details
      homeTerminalTimezone: "America/Los_Angeles",
      cycleType: "USA_70_8",
      cargoType: "PTY",
      restartHours: "34",
      restBreakRequired: "30_RB",
      yearsOfExperience: "",
      dob: "",
      lastDrugTest: "",
      medicalExpiration: "",
      fleetCardNumber: "",
      avgDailyMileage: "",
      dateOfHire: "",
      recruitedBy: "",
      lastDutyStatus: "",
      lastDutyTime: "",
      physicalExpiration: "",
      twicExpiration: "",
      cdlIssuanceDate: "",
      mvrExpiration: "",
      registeredForClearinghouse: false,
      clearingHouseRegDate: new Date().toISOString().split("T")[0],
      drugAlcoholPositive: false,
      revokedLicenses: false,
      drivingConvictions: false,
      drugConvictions: false,
      endorsements: [] as string[],
      twicNo: "",
      vendorId: "",
      classId: "",
      taxType: "",
      box1099: "",
    },
  });

  const watchedValues = watch();
  const country = watch("licenseCountry");

  // State options based on license country
  const stateOptions = useMemo(() => {
    switch (country) {
      case "CA":
        return CANADA_PROVINCES;
      case "MX":
        return MEXICO_STATES;
      default:
        return US_STATES;
    }
  }, [country]);

  // Reset state when country changes in add mode
  useEffect(() => {
    if (country && modalMode === "add") {
      setValue("licenseState", "");
    }
  }, [country, setValue, modalMode]);

  // Modal close handler
  const handleModalClose = useCallback(async () => {
    setShowDriverModal(false);
    setModalMode("add");
    setStepNumber(0);
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  // Handle adding new driver
  const handleAddDriver = useCallback(() => {
    setModalMode("add");
    setStepNumber(0);
    reset();
    setShowDriverModal(true);
  }, [reset]);

  // Handle previous step
  const handlePrev = useCallback(() => {
    setStepNumber((prev) => prev - 1);
  }, []);

  // Submit / next step handler
  const onSubmit = useCallback(
    async (data: any) => {
      const totalSteps = DRIVER_FORM_STEPS.length;
      const isLastStep = stepNumber === totalSteps - 1;

      if (modalMode === "view") {
        if (!isLastStep) {
          setStepNumber((prev) => prev + 1);
          return;
        } else {
          handleModalClose();
          return;
        }
      }

      if (!isLastStep) {
        const isStepValid = await trigger();
        if (!isStepValid) {
          toast.error("Please fix the validation errors before proceeding");
          return;
        }
        setStepNumber((prev) => prev + 1);
        clearErrors();
        return;
      }

      // TODO: wire up API calls here
      console.log("Driver form submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Driver added successfully"
          : "Driver updated successfully",
      );
      reset();
      setShowDriverModal(false);
      setModalMode("add");
      setStepNumber(0);
    },
    [stepNumber, modalMode, trigger, clearErrors, handleModalClose, reset],
  );

  // Modal config per mode and step
  const getModalConfig = useCallback(() => {
    const configs = {
      add: {
        title: "Add New Driver TMS",
        submitText:
          stepNumber !== DRIVER_FORM_STEPS.length - 1 ? "Next" : "Add Driver",
      },
      edit: {
        title: "Edit Driver",
        submitText:
          stepNumber !== DRIVER_FORM_STEPS.length - 1
            ? "Next"
            : "Update Driver",
      },
      view: {
        title: "Driver Details",
        submitText:
          stepNumber !== DRIVER_FORM_STEPS.length - 1 ? "Next" : "Close",
      },
    };
    return configs[modalMode];
  }, [modalMode, stepNumber]);

  const modalConfig = getModalConfig();
  const isReadOnly = modalMode === "view";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Drivers
        </h2>
        <Button
          text="Add Driver"
          className="btn-dark"
          onClick={handleAddDriver}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Driver Modal */}
      <Modal
        centered
        className="max-w-4xl"
        title={modalConfig.title}
        activeModal={showDriverModal}
        onClose={handleModalClose}
      >
        {/* Progress Steps — identical pattern to shared code */}
        <div className="flex items-center relative justify-center md:mx-8 mb-10">
          {DRIVER_FORM_STEPS.map((item, i) => (
            <div
              className="relative z-1 items-center item flex flex-start flex-1 last:flex-none group"
              key={i}
            >
              <div
                className={`${stepNumber >= i
                  ? "bg-slate-900 text-white ring-slate-900 ring-offset-2 dark:ring-offset-slate-500 dark:bg-slate-900 dark:ring-slate-900"
                  : "bg-white ring-slate-900 ring-opacity-70 text-slate-900 dark:text-slate-300 dark:bg-slate-600 dark:ring-slate-600 text-opacity-70"
                  } transition duration-150 icon-box md:h-12 md:w-12 h-7 w-7 rounded-full flex flex-col items-center justify-center relative z-66 ring-1 md:text-lg text-base font-medium`}
              >
                {stepNumber <= i ? (
                  <span>{i + 1}</span>
                ) : (
                  <span className="text-3xl">
                    <Icon icon="bx:check-double" />
                  </span>
                )}
              </div>

              <div
                className={`${stepNumber >= i
                  ? "bg-slate-900 dark:bg-slate-900"
                  : "bg-[#E0EAFF] dark:bg-slate-700"
                  } absolute top-1/2 h-0.5 w-full`}
              />

              <div
                className={`${stepNumber >= i
                  ? "text-slate-900 dark:text-slate-300"
                  : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                  } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100`}
              >
                <span className="w-max">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[55vh] overflow-y-auto px-1 pt-2 overscroll-contain">
              {/* ── Step 1: Driver Details ── */}
              {stepNumber === 0 && (
                <div>
                  {/* Freeze Pay / Extra Pay */}
                  <div className="flex items-center gap-8 pt-10 mt-5">
                    <Switch
                      name="freezePay"
                      label="Freeze Pay"
                      value={watchedValues.freezePay || false}
                      onChange={(e) =>
                        setValue("freezePay", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                    <Switch
                      name="extraPay"
                      label="Extra Pay"
                      value={watchedValues.extraPay || false}
                      onChange={(e) =>
                        setValue("extraPay", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                  </div>


                  {/* Freeze Pay conditional fields */}
                  {watchedValues.freezePay && (
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mt-4">
                      <TextInput
                        label="Freeze Pay Date"
                        type="date"
                        name="freezePayDate"
                        value={watchedValues.freezePayDate || ""}
                        error={errors.freezePayDate}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Freeze Pay Reason"
                        type="text"
                        placeholder="Enter freeze pay reason"
                        name="freezePayReason"
                        value={watchedValues.freezePayReason || ""}
                        error={errors.freezePayReason}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                    </div>
                  )}
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-6">


                    <TextInput
                      label="First Name"
                      type="text"
                      placeholder="Type your First Name"
                      name="firstName"
                      value={watchedValues.firstName}
                      error={errors.firstName}
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Middle Name"
                      type="text"
                      placeholder="Type your Middle Name"
                      name="middleName"
                      value={watchedValues.middleName || ""}
                      error={errors.middleName}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Last Name"
                      type="text"
                      placeholder="Type your Last Name"
                      name="lastName"
                      value={watchedValues.lastName}
                      error={errors.lastName}
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Nick Name"
                      type="text"
                      placeholder="Type your Nick Name"
                      name="nickName"
                      value={watchedValues.nickName || ""}
                      error={errors.nickName}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="Type your Email"
                      name="email"
                      value={watchedValues.email}
                      error={errors.email}
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Driver Company ID"
                      type="text"
                      placeholder="Driver Company ID"
                      name="driverCompanyId"
                      value={watchedValues.driverCompanyId || ""}
                      error={errors.driverCompanyId}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Integration ID"
                      type="text"
                      placeholder="Integration ID"
                      name="integrationId"
                      value={watchedValues.integrationId || ""}
                      error={errors.integrationId}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <CustomSelectRadix
                      label="Driver Type"
                      name="driverType"
                      options={DRIVER_TYPE_OPTIONS}
                      required
                      control={control}
                      error={errors.driverType}
                      placeholder="Select Option"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />

                    <CustomSelectRadix
                      label="Tax Form"
                      name="taxForm"
                      options={TAX_FORM_OPTIONS}
                      required
                      control={control}
                      error={errors.taxForm}
                      placeholder="Select Option"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />

                    <CustomSelectRadix
                      label="Route Type"
                      name="routeType"
                      options={ROUTE_TYPE_OPTIONS}
                      control={control}
                      error={errors.routeType}
                      placeholder="Select Option"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />

                    <TextInput
                      label="DBA Name"
                      type="text"
                      placeholder="DBA Name"
                      name="dbaName"
                      value={watchedValues.dbaName || ""}
                      error={errors.dbaName}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <div className="flex items-center gap-8">
                      <Switch
                        name="perDiem"
                        label="Per Diem"
                        value={watchedValues.perDiem || false}
                        onChange={(e) =>
                          setValue("perDiem", e.target.checked, { shouldDirty: true })
                        }
                        disabled={isReadOnly}
                      />
                      <Switch
                        name="terminated"
                        label="Terminated"
                        value={watchedValues.terminated || false}
                        onChange={(e) =>
                          setValue("terminated", e.target.checked, { shouldDirty: true })
                        }
                        disabled={isReadOnly}
                      />
                    </div>

                    {/* Terminated conditional fields */}
                    {watchedValues.terminated && (
                      <div className="lg:col-span-3 md:col-span-2 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                        <TextInput
                          label="Termination Date"
                          type="date"
                          name="terminationDate"
                          value={watchedValues.terminationDate || ""}
                          error={errors.terminationDate}
                          register={register}
                          required
                          readOnly={isReadOnly}
                          defaultValue={new Date().toISOString().split("T")[0]}
                        />
                        <div className="lg:col-span-2">
                          <CustomSelectRadix
                            label="Termination Reason Code"
                            name="terminationReasonCode"
                            options={TERMINATION_REASON_CODES}
                            required
                            control={control}
                            error={errors.terminationReasonCode}
                            placeholder="Select"
                            disabled={isReadOnly}
                            isSearchable={true}
                          />
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => setShowTerminationReasonModal(true)}
                              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
                            >
                              +Create New
                            </button>
                          )}
                        </div>
                        <div className="lg:col-span-3">
                          <TextInput
                            label="Termination Reason"
                            type="text"
                            placeholder="Enter termination reason"
                            name="terminationReason"
                            value={watchedValues.terminationReason || ""}
                            error={errors.terminationReason}
                            register={register}
                            readOnly={isReadOnly}
                          />
                        </div>
                      </div>
                    )}

                    <TextInput
                      label="Driver License"
                      type="text"
                      placeholder="Type your License Number"
                      name="licenseNumber"
                      value={watchedValues.licenseNumber}
                      error={errors.licenseNumber}
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Driver License Expiration Date"
                      type="date"
                      name="licenseExpiration"
                      value={watchedValues.licenseExpiration}
                      error={errors.licenseExpiration}
                      min={new Date().toISOString().split("T")[0]}
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <CustomSelectRadix
                      label="License Country"
                      name="licenseCountry"
                      options={COUNTRY_OPTIONS}
                      required
                      control={control}
                      error={errors.licenseCountry}
                      placeholder="Select Country"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <CustomSelectRadix
                      label="License State/Province"
                      name="licenseState"
                      options={stateOptions}
                      required
                      control={control}
                      error={errors.licenseState}
                      placeholder={`Select ${country === "CA" ? "Province" : "State"}`}
                      key={country}
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <TextInput
                      label="Hire Date"
                      type="date"
                      name="hireDate"
                      value={watchedValues.hireDate}
                      error={errors.hireDate}
                      register={register}
                      required
                      readOnly={isReadOnly}
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />

                    <TextInput
                      label="PIN"
                      type="password"
                      placeholder="5-digit PIN"
                      name="pin"
                      value={watchedValues.pin}
                      error={errors.pin}
                      maxLength={5}
                      hasicon
                      register={register}
                      required
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Confirm PIN"
                      type="password"
                      placeholder="Confirm PIN"
                      name="confirmPassword"
                      value={watchedValues.confirmPassword}
                      maxLength={5}
                      error={errors.confirmPassword}
                      register={register}
                      hasicon
                      required
                      readOnly={isReadOnly}
                    />

                    <div className="lg:col-span-3 md:col-span-2">
                      <Switch
                        name="isLogRocketEnabled"
                        label="Enable LogRocket"
                        value={watchedValues.isLogRocketEnabled || false}
                        onChange={(e) => {
                          setValue("isLogRocketEnabled", e.target.checked, {
                            shouldDirty: true,
                          });
                        }}
                        disabled={isReadOnly}
                        description="Enable LogRocket session replay and logging for this driver"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Contact Info ── */}
              {stepNumber === 1 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-10 mt-5">
                  <TextInput
                    label="Address"
                    type="text"
                    placeholder="Please enter 1 or more characters"
                    name="address"
                    value={watchedValues.address || ""}
                    error={errors.address}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Address Line 2 (Optional)"
                    type="text"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    name="address2"
                    value={watchedValues.address2 || ""}
                    error={errors.address2}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="City"
                    type="text"
                    placeholder="Please enter 1 or more characters"
                    name="city"
                    value={watchedValues.city || ""}
                    error={errors.city}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="State"
                    name="state"
                    options={US_STATES}
                    control={control}
                    error={errors.state}
                    placeholder="Select State"
                    disabled={isReadOnly}
                    isSearchable={true}
                  />

                  <TextInput
                    label="Zip Code"
                    type="text"
                    placeholder="Zip Code"
                    name="zipCode"
                    value={watchedValues.zipCode || ""}
                    error={errors.zipCode}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <InputGroup
                    label="Cell Phone"
                    name="cellPhone"
                    inputPlaceholder="Enter phone number"
                    inputValue={watchedValues.cell || ""}
                    leftElement="select"
                    leftSelectOptions={CELL_COUNTRY_CODES}
                    leftSelectValue={watchedValues.cellCountryCode || "US"}
                    leftSelectName="cellCountryCode"
                    leftSelectSearchable={true}
                    leftElementWidth="100px"
                    size="md"
                    control={control}
                    required
                    error={errors.cell || errors.cellCountryCode}
                    onInputChange={(e) => {
                      const cleanedValue = e.target.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                      setValue("cell", cleanedValue, { shouldDirty: true });
                      if (cleanedValue) {
                        setTimeout(() => trigger("cell"), 100);
                      }
                    }}
                    onLeftSelectChange={(value) => {
                      setValue("cellCountryCode", String(value), {
                        shouldDirty: true,
                      });
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />

                  <TextInput
                    label="Phone"
                    type="text"
                    placeholder="Phone number"
                    name="phone"
                    value={watchedValues.phone || ""}
                    error={errors.phone}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Emergency Phone"
                    type="text"
                    placeholder="Emergency phone number"
                    name="emergencyPhone"
                    value={watchedValues.emergencyPhone || ""}
                    error={errors.emergencyPhone}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Emergency Contact"
                    type="text"
                    placeholder="Contact name"
                    name="emergencyContact"
                    value={watchedValues.emergencyContact || ""}
                    error={errors.emergencyContact}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="SSN"
                    type="text"
                    placeholder="Social Security Number"
                    name="ssn"
                    value={watchedValues.ssn || ""}
                    error={errors.ssn}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Driver EIN Number"
                    type="text"
                    placeholder="EIN Number"
                    name="einNumber"
                    value={watchedValues.einNumber || ""}
                    error={errors.einNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Home City"
                    type="text"
                    placeholder="Home city"
                    name="homeCity"
                    value={watchedValues.homeCity || ""}
                    error={errors.homeCity}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Home State"
                    name="homeState"
                    options={US_STATES}
                    control={control}
                    error={errors.homeState}
                    placeholder="Select State"
                    disabled={isReadOnly}
                    isSearchable={true}
                  />

                  <TextInput
                    label="Note"
                    type="text"
                    placeholder="Additional notes (optional)"
                    name="note"
                    value={watchedValues.note || ""}
                    error={errors.note}
                    register={register}
                    readOnly={isReadOnly}
                  />
                </div>
              )}

              {/* ── Step 3: Rate Card ── */}
              {stepNumber === 2 && (
                <div>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-10 mt-5">
                    <TextInput
                      label="Mileage Rate"
                      type="number"
                      placeholder="0"
                      name="mileageRate"
                      value={watchedValues.mileageRate || ""}
                      error={errors.mileageRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Empty Mileage Rate"
                      type="number"
                      placeholder="0"
                      name="emptyMileageRate"
                      value={watchedValues.emptyMileageRate || ""}
                      error={errors.emptyMileageRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Layover Rate"
                      type="number"
                      placeholder="0"
                      name="layoverRate"
                      value={watchedValues.layoverRate || ""}
                      error={errors.layoverRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Lay/Over Percentage"
                      type="number"
                      placeholder="0"
                      name="layoverPercentage"
                      value={watchedValues.layoverPercentage || ""}
                      error={errors.layoverPercentage}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Detention Rate"
                      type="number"
                      placeholder="0"
                      name="detentionRate"
                      value={watchedValues.detentionRate || ""}
                      error={errors.detentionRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Detention Percentage"
                      type="number"
                      placeholder="0"
                      name="detentionPercentage"
                      value={watchedValues.detentionPercentage || ""}
                      error={errors.detentionPercentage}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Other Flat"
                      type="number"
                      placeholder="0"
                      name="otherFlat"
                      value={watchedValues.otherFlat || ""}
                      error={errors.otherFlat}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Other Percentage"
                      type="number"
                      placeholder="0"
                      name="otherPercentage"
                      value={watchedValues.otherPercentage || ""}
                      error={errors.otherPercentage}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Hourly Rate (7 - 8 hrs)"
                      type="number"
                      placeholder="0"
                      name="hourlyRate"
                      value={watchedValues.hourlyRate || ""}
                      error={errors.hourlyRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Over Time Rate (8 - 10 hrs)"
                      type="number"
                      placeholder="0"
                      name="overTimeRate8"
                      value={watchedValues.overTimeRate8 || ""}
                      error={errors.overTimeRate8}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Over Time Rate (10+ hrs)"
                      type="number"
                      placeholder="0"
                      name="overTimeRate10"
                      value={watchedValues.overTimeRate10 || ""}
                      error={errors.overTimeRate10}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Weekly Hourly Rate"
                      type="number"
                      placeholder="0"
                      name="weeklyHourlyRate"
                      value={watchedValues.weeklyHourlyRate || ""}
                      error={errors.weeklyHourlyRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Weekly OverTime Rate (40 - 80 hrs)"
                      type="number"
                      placeholder="0"
                      name="weeklyOvertimeRate40"
                      value={watchedValues.weeklyOvertimeRate40 || ""}
                      error={errors.weeklyOvertimeRate40}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Weekly OverTime Rate (80+ hrs)"
                      type="number"
                      placeholder="0"
                      name="weeklyOvertimeRate80"
                      value={watchedValues.weeklyOvertimeRate80 || ""}
                      error={errors.weeklyOvertimeRate80}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Per Stop Pay"
                      type="number"
                      placeholder="0"
                      name="perStopPay"
                      value={watchedValues.perStopPay || ""}
                      error={errors.perStopPay}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="After Stop"
                      type="number"
                      placeholder="0"
                      name="afterStop"
                      value={watchedValues.afterStop || ""}
                      error={errors.afterStop}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <div className="flex items-end pb-1">
                      <Switch
                        name="allStops"
                        label="All Stops"
                        value={watchedValues.allStops || false}
                        onChange={(e) => {
                          setValue("allStops", e.target.checked, { shouldDirty: true });
                          if (e.target.checked) {
                            setValue("afterStop", "0", { shouldDirty: true });
                          }
                        }}
                        disabled={isReadOnly}
                      />
                    </div>

                    <TextInput
                      label="Invoice %"
                      type="number"
                      placeholder="0"
                      name="invoicePercentage"
                      value={watchedValues.invoicePercentage || ""}
                      error={errors.invoicePercentage}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Fuel Surcharge %"
                      type="number"
                      placeholder="0"
                      name="fuelSurcharge"
                      value={watchedValues.fuelSurcharge || ""}
                      error={errors.fuelSurcharge}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Daily Rate"
                      type="number"
                      placeholder="0"
                      name="dailyRate"
                      value={watchedValues.dailyRate || ""}
                      error={errors.dailyRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <CustomSelectRadix
                      label="Pay Method"
                      name="payMethod"
                      options={PAY_METHOD_OPTIONS}
                      control={control}
                      error={errors.payMethod}
                      placeholder="Select Pay Method"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />
                  </div>

                  {/* Team Rate Card */}
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                    <TextInput
                      label="Team Mileage Rate"
                      type="number"
                      placeholder="0"
                      name="teamMileageRate"
                      value={watchedValues.teamMileageRate || ""}
                      error={errors.teamMileageRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Team Empty Mileage Rate"
                      type="number"
                      placeholder="0"
                      name="teamEmptyMileageRate"
                      value={watchedValues.teamEmptyMileageRate || ""}
                      error={errors.teamEmptyMileageRate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Per Stop Pay For Team"
                      type="number"
                      placeholder="0"
                      name="perStopPayTeam"
                      value={watchedValues.perStopPayTeam || ""}
                      error={errors.perStopPayTeam}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="After Stop For Team"
                      type="number"
                      placeholder="0"
                      name="afterStopTeam"
                      value={watchedValues.afterStopTeam || ""}
                      error={errors.afterStopTeam}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <div className="flex items-end pb-1">
                      <Switch
                        name="allStopsTeam"
                        label="All Stops For Team"
                        value={watchedValues.allStopsTeam || false}
                        onChange={(e) => {
                          setValue("allStopsTeam", e.target.checked, { shouldDirty: true });
                          if (e.target.checked) {
                            setValue("afterStopTeam", "0", { shouldDirty: true });
                          }
                        }}
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: More Details ── */}
              {stepNumber === 3 && (
                <div>
                  {/* Cycle Info */}
                  <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 pt-4 mt-2">
                    <CustomSelectRadix
                      label="Home Terminal Timezone"
                      name="homeTerminalTimezone"
                      options={TIMEZONE_OPTIONS.map((timezone) => ({
                        label: timezone.name,
                        value: timezone.code,
                      }))}
                      required
                      control={control}
                      error={errors.homeTerminalTimezone}
                      placeholder="Select Timezone"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <CustomSelectRadix
                      label="Cycle Type"
                      name="cycleType"
                      options={CYCLE_TYPES.map((cycleType) => ({
                        label: cycleType.label,
                        value: cycleType.code,
                      }))}
                      required
                      control={control}
                      error={errors.cycleType}
                      placeholder="Select Cycle Type"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <CustomSelectRadix
                      label="Cargo Type"
                      name="cargoType"
                      options={CARGO_TYPES.map((cargoType) => ({
                        label: cargoType.label,
                        value: cargoType.code,
                      }))}
                      required
                      control={control}
                      error={errors.cargoType}
                      placeholder="Select Cargo Type"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <CustomSelectRadix
                      label="Restart Hours"
                      name="restartHours"
                      options={RESTART_HOURS.map((restartHour) => ({
                        label: restartHour.label,
                        value: restartHour.value,
                      }))}
                      required
                      control={control}
                      error={errors.restartHours}
                      placeholder="Select Restart Hours"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <CustomSelectRadix
                      label="Rest Break Required"
                      name="restBreakRequired"
                      options={REST_BREAKS_REQUIRED.map((restBreak) => ({
                        label: restBreak.label,
                        value: restBreak.code,
                      }))}
                      required
                      control={control}
                      error={errors.restBreakRequired}
                      placeholder="Select Rest Break"
                      disabled={isReadOnly}
                      isSearchable={true}
                    />

                    <TextInput
                      label="Years of Experience"
                      type="number"
                      placeholder="0"
                      name="yearsOfExperience"
                      value={watchedValues.yearsOfExperience || ""}
                      error={errors.yearsOfExperience}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Driver Date of Birth"
                      type="date"
                      name="dob"
                      value={watchedValues.dob || ""}
                      error={errors.dob}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Last Drug Test Date"
                      type="date"
                      name="lastDrugTest"
                      value={watchedValues.lastDrugTest || ""}
                      error={errors.lastDrugTest}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Medical Expiration Date"
                      type="date"
                      name="medicalExpiration"
                      value={watchedValues.medicalExpiration || ""}
                      error={errors.medicalExpiration}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Fleet Card Number"
                      type="text"
                      placeholder="Fleet card number"
                      name="fleetCardNumber"
                      value={watchedValues.fleetCardNumber || ""}
                      error={errors.fleetCardNumber}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Avg Daily Mileage"
                      type="number"
                      placeholder="0"
                      name="avgDailyMileage"
                      value={watchedValues.avgDailyMileage || ""}
                      error={errors.avgDailyMileage}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Date of Hire"
                      type="date"
                      name="dateOfHire"
                      value={watchedValues.dateOfHire || ""}
                      error={errors.dateOfHire}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Recruited By"
                      type="text"
                      placeholder="Recruiter name"
                      name="recruitedBy"
                      value={watchedValues.recruitedBy || ""}
                      error={errors.recruitedBy}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Last Duty Status"
                      type="text"
                      placeholder="Last duty status"
                      name="lastDutyStatus"
                      value={watchedValues.lastDutyStatus || ""}
                      error={errors.lastDutyStatus}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Last Duty Time"
                      type="datetime-local"
                      name="lastDutyTime"
                      value={watchedValues.lastDutyTime || ""}
                      error={errors.lastDutyTime}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Physical Expiration"
                      type="date"
                      name="physicalExpiration"
                      value={watchedValues.physicalExpiration || ""}
                      error={errors.physicalExpiration}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="TWIC Card Expiration"
                      type="date"
                      name="twicExpiration"
                      value={watchedValues.twicExpiration || ""}
                      error={errors.twicExpiration}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="CDL Issuance Date"
                      type="date"
                      name="cdlIssuanceDate"
                      value={watchedValues.cdlIssuanceDate || ""}
                      error={errors.cdlIssuanceDate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="MVR Expiration Date"
                      type="date"
                      name="mvrExpiration"
                      value={watchedValues.mvrExpiration || ""}
                      error={errors.mvrExpiration}
                      register={register}
                      readOnly={isReadOnly}
                    />
                  </div>

                  {/* Compliance */}
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                    <Switch
                      name="registeredForClearinghouse"
                      label="Registered for ClearingHouse"
                      value={watchedValues.registeredForClearinghouse || false}
                      onChange={(e) =>
                        setValue("registeredForClearinghouse", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    {watchedValues.registeredForClearinghouse && (
                      <TextInput
                        label="Clear Housing reg date"
                        type="date"
                        name="clearingHouseRegDate"
                        value={watchedValues.clearingHouseRegDate || ""}
                        error={errors.clearingHouseRegDate}
                        register={register}
                        required
                        readOnly={isReadOnly}
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    )}

                    <Switch
                      name="drugAlcoholPositive"
                      label="Drug & Alcohol Positive Tests Or Refusals"
                      value={watchedValues.drugAlcoholPositive || false}
                      onChange={(e) =>
                        setValue("drugAlcoholPositive", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    <Switch
                      name="revokedLicenses"
                      label="Revoked Licenses"
                      value={watchedValues.revokedLicenses || false}
                      onChange={(e) =>
                        setValue("revokedLicenses", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    <Switch
                      name="drivingConvictions"
                      label="Driving Convictions"
                      value={watchedValues.drivingConvictions || false}
                      onChange={(e) =>
                        setValue("drivingConvictions", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    <Switch
                      name="drugConvictions"
                      label="Drug And Alcohol Convictions"
                      value={watchedValues.drugConvictions || false}
                      onChange={(e) =>
                        setValue("drugConvictions", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                  </div>

                  {/* Endorsements */}
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Endorsements
                    </p>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                      {ENDORSEMENT_OPTIONS.map((endorsement) => (
                        <label
                          key={endorsement.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            disabled={isReadOnly}
                            checked={(
                              watchedValues.endorsements || []
                            ).includes(endorsement.value)}
                            onChange={(e) => {
                              const current =
                                watchedValues.endorsements || [];
                              const updated = e.target.checked
                                ? [...current, endorsement.value]
                                : current.filter(
                                  (v) => v !== endorsement.value,
                                );
                              setValue("endorsements", updated, {
                                shouldDirty: true,
                              });
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:cursor-not-allowed"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {endorsement.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Accounting */}
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                    <TextInput
                      label="TWIC No"
                      type="text"
                      placeholder="TWIC number"
                      name="twicNo"
                      value={watchedValues.twicNo || ""}
                      error={errors.twicNo}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Vendor ID"
                      type="text"
                      placeholder="Vendor ID"
                      name="vendorId"
                      value={watchedValues.vendorId || ""}
                      error={errors.vendorId}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <CustomSelectRadix
                      label="Class ID"
                      name="classId"
                      options={CLASS_ID_OPTIONS}
                      control={control}
                      error={errors.classId}
                      placeholder="Select"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />

                    <CustomSelectRadix
                      label="Tax Type"
                      name="taxType"
                      options={TAX_TYPE_OPTIONS}
                      control={control}
                      error={errors.taxType}
                      placeholder="Select"
                      disabled={isReadOnly}
                      isSearchable={false}
                    />

                    <TextInput
                      label="1099 Box"
                      type="text"
                      placeholder="Box #"
                      name="box1099"
                      value={watchedValues.box1099 || ""}
                      error={errors.box1099}
                      register={register}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions — identical pattern to shared code */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              {modalMode === "view" ? (
                <>
                  {stepNumber === 0 && (
                    <>
                      <Button
                        text="Cancel"
                        className="btn-outline-dark"
                        onClick={handleModalClose}
                        type="button"
                      />
                      <Button
                        text="Next"
                        className="btn-dark"
                        onClick={() => setStepNumber(1)}
                        type="button"
                      />
                    </>
                  )}
                  {stepNumber > 0 && (
                    <>
                      <Button
                        text="Previous"
                        className="btn-outline-dark"
                        onClick={handlePrev}
                        type="button"
                      />
                      <Button
                        text={
                          stepNumber === DRIVER_FORM_STEPS.length - 1
                            ? "Close"
                            : "Next"
                        }
                        className="btn-dark"
                        onClick={
                          stepNumber === DRIVER_FORM_STEPS.length - 1
                            ? handleModalClose
                            : () => setStepNumber((prev) => prev + 1)
                        }
                        type="button"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex gap-4">
                    {stepNumber !== 0 && (
                      <Button
                        text="Previous"
                        className="btn-outline-dark"
                        onClick={handlePrev}
                        type="button"
                      />
                    )}
                    {stepNumber === 0 && (
                      <Button
                        text="Cancel"
                        className="btn-outline-dark"
                        onClick={handleModalClose}
                        type="button"
                      />
                    )}
                  </div>
                  <div className="flex justify-end w-full">
                    <Button
                      text={modalConfig.submitText}
                      className="btn-dark"
                      type="submit"
                      disabled={
                        modalMode === "edit" &&
                        stepNumber === DRIVER_FORM_STEPS.length - 1 &&
                        !isDirty
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        centered
        className="max-w-lg"
        title="Create new Termination Reason Code"
        activeModal={showTerminationReasonModal}
        onClose={() => {
          setShowTerminationReasonModal(false);
          setTerminationCodeForm({ code: "", description: "" });
        }}
      >
        <div className="flex flex-col gap-5 pt-4">
          <TextInput
            label="Code"
            type="text"
            placeholder=""
            name="termCode"
            value={terminationCodeForm.code}
            onChange={(e) =>
              setTerminationCodeForm((prev) => ({ ...prev, code: e.target.value }))
            }
          />
          <TextInput
            label="Description"
            type="text"
            placeholder=""
            name="termDescription"
            value={terminationCodeForm.description}
            onChange={(e) =>
              setTerminationCodeForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              text="Cancel"
              className="btn-outline-dark"
              type="button"
              onClick={() => {
                setShowTerminationReasonModal(false);
                setTerminationCodeForm({ code: "", description: "" });
              }}
            />
            <Button
              text="Save"
              className="btn-primary"
              type="button"
              onClick={() => {
                // TODO: wire up save API
                console.log("New termination code:", terminationCodeForm);
                setShowTerminationReasonModal(false);
                setTerminationCodeForm({ code: "", description: "" });
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Drivers;