import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import { toast } from "react-toastify";
import { carrierValidationSchema } from "./helper/validationSchema";
import { BANK_ACCOUNT_TYPE_OPTIONS, CARRIER_FORM_STEPS, PARTNER_OPTIONS, SERVICE_TYPE_OPTIONS } from "./helper/constants";

type ModalMode = "add" | "edit" | "view";

// ─── Reusable Insurance Block ─────────────────────────────────────────────────

interface InsuranceBlockProps {
  title: string;
  prefix: string;
  watchedValues: any;
  errors: any;
  register: any;
  isReadOnly: boolean;
}

const InsuranceBlock: React.FC<InsuranceBlockProps> = ({
  title,
  prefix,
  watchedValues,
  errors,
  register,
  isReadOnly,
}) => (
  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
      {title}
    </legend>
    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
      <div className="lg:col-span-2 md:col-span-2">
        <TextInput
          label="Company"
          type="text"
          placeholder=""
          name={`${prefix}Company`}
          value={watchedValues[`${prefix}Company`] || ""}
          error={errors[`${prefix}Company`]}
          register={register}
          readOnly={isReadOnly}
        />
      </div>
      <TextInput
        label="Phone"
        type="text"
        placeholder=""
        name={`${prefix}Phone`}
        value={watchedValues[`${prefix}Phone`] || ""}
        error={errors[`${prefix}Phone`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Agent"
        type="text"
        placeholder=""
        name={`${prefix}Agent`}
        value={watchedValues[`${prefix}Agent`] || ""}
        error={errors[`${prefix}Agent`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Agent Phone"
        type="text"
        placeholder=""
        name={`${prefix}AgentPhone`}
        value={watchedValues[`${prefix}AgentPhone`] || ""}
        error={errors[`${prefix}AgentPhone`]}
        register={register}
        readOnly={isReadOnly}
      />
    </div>
    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
      <TextInput
        label={prefix === "ci" ? "Policy nbr" : "Policy #"}
        type="text"
        placeholder=""
        name={prefix === "ci" ? `${prefix}PolicyNbr` : `${prefix}PolicyNumber`}
        value={watchedValues[prefix === "ci" ? `${prefix}PolicyNbr` : `${prefix}PolicyNumber`] || ""}
        error={errors[prefix === "ci" ? `${prefix}PolicyNbr` : `${prefix}PolicyNumber`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Expiration"
        type="date"
        name={`${prefix}Expiration`}
        value={watchedValues[`${prefix}Expiration`] || ""}
        error={errors[`${prefix}Expiration`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Limit"
        type="text"
        placeholder=""
        name={`${prefix}Limit`}
        value={watchedValues[`${prefix}Limit`] || ""}
        error={errors[`${prefix}Limit`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="City"
        type="text"
        placeholder=""
        name={`${prefix}City`}
        value={watchedValues[`${prefix}City`] || ""}
        error={errors[`${prefix}City`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="State"
        type="text"
        placeholder=""
        name={`${prefix}State`}
        value={watchedValues[`${prefix}State`] || ""}
        error={errors[`${prefix}State`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Zip code"
        type="text"
        placeholder=""
        name={`${prefix}ZipCode`}
        value={watchedValues[`${prefix}ZipCode`] || ""}
        error={errors[`${prefix}ZipCode`]}
        register={register}
        readOnly={isReadOnly}
      />
    </div>
    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5">
      <TextInput
        label="Fax"
        type="text"
        placeholder=""
        name={`${prefix}Fax`}
        value={watchedValues[`${prefix}Fax`] || ""}
        error={errors[`${prefix}Fax`]}
        register={register}
        readOnly={isReadOnly}
      />
      <TextInput
        label="Deductable"
        type="text"
        placeholder=""
        name={`${prefix}Deductable`}
        value={watchedValues[`${prefix}Deductable`] || ""}
        error={errors[`${prefix}Deductable`]}
        register={register}
        readOnly={isReadOnly}
      />
      <div className="lg:col-span-4 md:col-span-1">
        <TextInput
          label="Notes"
          type="text"
          placeholder=""
          name={`${prefix}Notes`}
          value={watchedValues[`${prefix}Notes`] || ""}
          error={errors[`${prefix}Notes`]}
          register={register}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  </fieldset>
);

// ─── Component ────────────────────────────────────────────────────────────────

const CarriersTMS: React.FC = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");

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
    resolver: yupResolver(carrierValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      // Step 1
      serviceType: "",
      carrierName: "",
      contactPerson: "",
      mc: "",
      dot: "",
      fedTaxId: "",
      scacCode: "",
      customCarrierId: "",
      mcpId: "",
      rmisId: "",
      highwayId: "",
      partner: "",
      registration: "",
      dbaName: "",
      status: true,
      track1099: false,
      ltlConnectAccountId: "",
      project44AccountNumber: "",
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      fax: "",
      email: "",
      website: "",
      notes: "",
      manageSettlements: true,
      carrierSettlements: false,
      manageCompliance: false,
      manageMaintenance: false,
      manageInvoicing: true,
      manageSourcing: false,
      manageExpense: false,
      useFactoring: false,
      // Step 2
      plCompany: "", plPhone: "", plAgent: "", plAgentPhone: "", plEmail: "",
      plPolicyNumber: "", plExpiration: "", plLimit: "", plCity: "", plState: "", plZipCode: "",
      plFax: "", plDeductable: "", plNotes: "",
      ciCompany: "", ciPhone: "", ciAgent: "", ciAgentPhone: "", ciEmail: "",
      ciPolicyNbr: "", ciExpiration: "", ciLimit: "", ciCity: "", ciState: "", ciZipCode: "",
      ciFax: "", ciDeductable: "", ciNotes: "",
      glCompany: "", glPhone: "", glAgent: "", glAgentPhone: "", glEmail: "",
      glPolicyNumber: "", glExpiration: "", glLimit: "", glCity: "", glState: "", glZipCode: "",
      glFax: "", glDeductable: "", glNotes: "",
      // Step 3
      fpSameAsCarrier: false,
      fpName: "", fpAddress: "", fpCity: "", fpState: "", fpCountry: "",
      fpZipCode: "", fpPhone: "", fpFax: "", fpEmail: "", fpWebsite: "", fpContactPerson: "",
      ipSameAsCarrier: false,
      ipName: "", ipAddress: "", ipCity: "", ipState: "",
      ipZipCode: "", ipPhone: "", ipFax: "", ipEmail: "", ipWebsite: "", ipContactPerson: "",
      rdSameAsCarrier: false,
      remitName: "", remitAddress: "", remitState2: "", remitCity: "", remitCountry: "",
      remitZipCode: "", remitPhone: "", remitFax: "", remitEmail: "",
      dispatchContactName: "", dispatchEmail: "",
      dispatchPhone1: "", dispatchPhone2: "", dispatchPhone3: "",
      netSuiteSubsidiaryName: "", netSuite1099AccountNumber: "", purchaseExpenseLineAccount: "",
      // Step 4
      modeLTL: false, modePartial: false, modeTruckLoad: false, modeRail: false,
      modeIntermodal: false, modeAir: false, modeExpedite: false, modeOcean: false,
      hazmatNumber: "", ctpatsvINumber: "", tankerEndorsedNumOfDrivers: "",
      hazmat: false, smartWay: false, carb: false, twic: false,
      ctpatCertified: false, tankerEndorsed: false,
      classConestoga: false, classContainers: false, classDecksSpecialized: false,
      classDecksStandard: false, classDryBulk: false, classFlatBeds: false,
      classHazardousMaterials: false, classReefers: false, classTankers: false,
      classVansSpecialized: false, classVansStandard: false, classOther: false,
      classOtherText: "",
      // Step 5
      fleetSize: "", totalPowerUnits: "", numberOfVehicles: "",
      reeferEquipment: false, vanEquipment: false, flatbedStepDeckEquipment: false,
      carrierBankRoutingNumber: "", carrierBankAccountNumber: "", carrierBankAccountName: "",
      carrierBankName: "", carrierBankAddress: "", carrierBankPhone: "",
      carrierBankFax: "", carrierBankAccountType: "",
      signatureDate: "", signaturePerson: "", signaturePersonTitle: "",
      signaturePersonUserName: "", signaturePersonPhoneNumber: "", isActive: false,
      billToEmail: "", billToAddress: "", billToInstructions: "",
    },
  });

  const watchedValues = watch();
  const isReadOnly = modalMode === "view";

  const handleModalClose = useCallback(async () => {
    setShowCarrierModal(false);
    setModalMode("add");
    setStepNumber(0);
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  const handleAddCarrier = useCallback(() => {
    setModalMode("add");
    setStepNumber(0);
    reset();
    setShowCarrierModal(true);
  }, [reset]);

  const handlePrev = useCallback(() => {
    setStepNumber((prev) => prev - 1);
  }, []);

  const onSubmit = useCallback(
    async (data: any) => {
      const totalSteps = CARRIER_FORM_STEPS.length;
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

      console.log("Carrier form submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Carrier added successfully"
          : "Carrier updated successfully",
      );
      reset();
      setShowCarrierModal(false);
      setModalMode("add");
      setStepNumber(0);
    },
    [stepNumber, modalMode, trigger, clearErrors, handleModalClose, reset],
  );

  const getModalConfig = useCallback(() => {
    const configs = {
      add: {
        title: "Add New Carrier",
        submitText:
          stepNumber !== CARRIER_FORM_STEPS.length - 1 ? "Next" : "Add Carrier",
      },
      edit: {
        title: "Edit Carrier",
        submitText:
          stepNumber !== CARRIER_FORM_STEPS.length - 1 ? "Next" : "Update Carrier",
      },
      view: {
        title: "Carrier Details",
        submitText:
          stepNumber !== CARRIER_FORM_STEPS.length - 1 ? "Next" : "Close",
      },
    };
    return configs[modalMode];
  }, [modalMode, stepNumber]);

  const modalConfig = getModalConfig();

  // Helper for Switch fields
  const sw = (name: string, label: string, description?: string) => (
    <Switch
      name={name}
      label={label}
      value={(watchedValues as any)[name] ?? false}
      onChange={(e) => setValue(name as any, e.target.checked, { shouldDirty: true })}
      disabled={isReadOnly}
      description={description}
    />
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Carriers
        </h2>
        <Button
          text="Add Carrier"
          className="btn-dark"
          onClick={handleAddCarrier}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Carrier Modal */}
      <Modal
        centered
        className="max-w-5xl"
        title={modalConfig.title}
        activeModal={showCarrierModal}
        onClose={handleModalClose}
      >
        {/* Progress Steps */}
        <div className="flex z-5 items-center relative justify-center md:mx-8 mb-10">
          {CARRIER_FORM_STEPS.map((item, i) => (
            <div
              className="relative z-1 items-center item flex flex-start flex-1 last:flex-none group"
              key={i}
            >
              <div
                className={`${
                  stepNumber >= i
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
                className={`${
                  stepNumber >= i
                    ? "bg-slate-900 dark:bg-slate-900"
                    : "bg-[#E0EAFF] dark:bg-slate-700"
                } absolute top-1/2 h-0.5 w-full`}
              />

              <div
                className={`${
                  stepNumber >= i
                    ? "text-slate-900 dark:text-slate-300"
                    : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100 text-center`}
              >
                <span className="block max-w-20 text-center leading-tight">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[55vh] overflow-y-auto px-1 pt-2 overscroll-contain space-y-5">

              {/* ── Step 1: Carrier Details ── */}
              {stepNumber === 0 && (
                <div className="space-y-5 pt-4">
                  {/* Type section */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Type
                    </legend>
                    <div className="w-56">
                      <CustomSelectRadix
                        label="Service Type"
                        name="serviceType"
                        options={SERVICE_TYPE_OPTIONS}
                        control={control}
                        error={errors.serviceType}
                        placeholder="Select"
                        disabled={isReadOnly}
                        isSearchable={false}
                        required
                      />
                    </div>
                  </fieldset>

                  {/* Carrier Details section */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Carrier Details
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <TextInput
                        label="Carrier Name"
                        type="text"
                        placeholder=""
                        name="carrierName"
                        value={watchedValues.carrierName}
                        error={errors.carrierName}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Contact person"
                        type="text"
                        placeholder=""
                        name="contactPerson"
                        value={watchedValues.contactPerson || ""}
                        error={errors.contactPerson}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="MC"
                        type="text"
                        placeholder=""
                        name="mc"
                        value={watchedValues.mc || ""}
                        error={errors.mc}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="DOT"
                        type="text"
                        placeholder=""
                        name="dot"
                        value={watchedValues.dot || ""}
                        error={errors.dot}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Fed tax id"
                        type="text"
                        placeholder=""
                        name="fedTaxId"
                        value={watchedValues.fedTaxId || ""}
                        error={errors.fedTaxId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="SCAC Code"
                        type="text"
                        placeholder=""
                        name="scacCode"
                        value={watchedValues.scacCode || ""}
                        error={errors.scacCode}
                        register={register}
                        readOnly={isReadOnly}
                      />
                    </div>

                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <TextInput
                        label="Custom Carrier Id"
                        type="text"
                        placeholder=""
                        name="customCarrierId"
                        value={watchedValues.customCarrierId || ""}
                        error={errors.customCarrierId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="MCPID"
                        type="text"
                        placeholder=""
                        name="mcpId"
                        value={watchedValues.mcpId || ""}
                        error={errors.mcpId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="RMISID"
                        type="text"
                        placeholder=""
                        name="rmisId"
                        value={watchedValues.rmisId || ""}
                        error={errors.rmisId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="HighWayID"
                        type="text"
                        placeholder=""
                        name="highwayId"
                        value={watchedValues.highwayId || ""}
                        error={errors.highwayId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <CustomSelectRadix
                        label="Partner"
                        name="partner"
                        options={PARTNER_OPTIONS}
                        control={control}
                        error={errors.partner}
                        placeholder="Select"
                        disabled={isReadOnly}
                        isSearchable={false}
                      />
                      <TextInput
                        label="Registration"
                        type="text"
                        placeholder=""
                        name="registration"
                        value={watchedValues.registration || ""}
                        error={errors.registration}
                        register={register}
                        readOnly={isReadOnly}
                      />
                    </div>

                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput
                        label="DBA Name"
                        type="text"
                        placeholder=""
                        name="dbaName"
                        value={watchedValues.dbaName || ""}
                        error={errors.dbaName}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <div className="flex items-end gap-6 pb-1">
                        {sw("status", "Status")}
                        {sw("track1099", "Track 1099")}
                      </div>
                      <div />
                      <div />
                      <TextInput
                        label="LTL Connect Account ID"
                        type="text"
                        placeholder=""
                        name="ltlConnectAccountId"
                        value={watchedValues.ltlConnectAccountId || ""}
                        error={errors.ltlConnectAccountId}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Project44 Account Number"
                        type="text"
                        placeholder=""
                        name="project44AccountNumber"
                        value={watchedValues.project44AccountNumber || ""}
                        error={errors.project44AccountNumber}
                        register={register}
                        readOnly={isReadOnly}
                      />
                    </div>
                  </fieldset>

                  {/* Contact section */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Contact
                    </legend>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
                      <TextInput
                        label="Address"
                        type="text"
                        placeholder="Please enter 1 or more characters"
                        name="address"
                        value={watchedValues.address || ""}
                        error={errors.address}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Address Line 2 (Optional)"
                        type="text"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        name="addressLine2"
                        value={watchedValues.addressLine2 || ""}
                        error={errors.addressLine2}
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
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="State"
                        type="text"
                        placeholder=""
                        name="state"
                        value={watchedValues.state || ""}
                        error={errors.state}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <TextInput
                        label="Zip code"
                        type="text"
                        placeholder=""
                        name="zipCode"
                        value={watchedValues.zipCode || ""}
                        error={errors.zipCode}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Phone"
                        type="text"
                        placeholder=""
                        name="phone"
                        value={watchedValues.phone || ""}
                        error={errors.phone}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Fax"
                        type="text"
                        placeholder=""
                        name="fax"
                        value={watchedValues.fax || ""}
                        error={errors.fax}
                        register={register}
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Email"
                        type="email"
                        placeholder=""
                        name="email"
                        value={watchedValues.email || ""}
                        error={errors.email}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                      <TextInput
                        label="Website"
                        type="text"
                        placeholder=""
                        name="website"
                        value={watchedValues.website || ""}
                        error={errors.website}
                        register={register}
                        readOnly={isReadOnly}
                      />
                    </div>
                    <TextInput
                      label="Notes"
                      type="text"
                      placeholder=""
                      name="notes"
                      value={watchedValues.notes || ""}
                      error={errors.notes}
                      register={register}
                      readOnly={isReadOnly}
                    />
                  </fieldset>

                  {/* Carrier Configuration section */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Carrier Configuration
                    </legend>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
                      {sw("manageSettlements", "Manage Settlements")}
                      {sw("carrierSettlements", "Carrier Settlements")}
                      {sw("manageCompliance", "Manage Compliance")}
                      {sw("manageMaintenance", "Manage Maintenance")}
                      {sw("manageInvoicing", "Manage Invoicing")}
                      {sw("manageSourcing", "Manage Sourcing")}
                      {sw("manageExpense", "Manage Expense")}
                      {sw("useFactoring", "Use Factoring")}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* ── Step 2: Insurance ── */}
              {stepNumber === 1 && (
                <div className="space-y-5 pt-4">
                  <InsuranceBlock
                    title="Primary Liability"
                    prefix="pl"
                    watchedValues={watchedValues}
                    errors={errors}
                    register={register}
                    isReadOnly={isReadOnly}
                  />
                  <InsuranceBlock
                    title="Cargo Insurance"
                    prefix="ci"
                    watchedValues={watchedValues}
                    errors={errors}
                    register={register}
                    isReadOnly={isReadOnly}
                  />
                  <InsuranceBlock
                    title="General Liability"
                    prefix="gl"
                    watchedValues={watchedValues}
                    errors={errors}
                    register={register}
                    isReadOnly={isReadOnly}
                  />
                </div>
              )}

              {/* ── Step 3: Payable & Remit ── */}
              {stepNumber === 2 && (
                <div className="space-y-5 pt-4">
                  {/* Factoring Payable To */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Factoring Payable To
                      <label className="flex items-center gap-1 font-normal cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={watchedValues.fpSameAsCarrier || false}
                          onChange={(e) =>
                            setValue("fpSameAsCarrier", e.target.checked, { shouldDirty: true })
                          }
                          disabled={isReadOnly}
                        />
                        <span>Same as carrier Address</span>
                      </label>
                    </legend>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
                      <TextInput label="Name" type="text" placeholder="" name="fpName" value={watchedValues.fpName || ""} error={errors.fpName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Address" type="text" placeholder="Please enter 1 or more characters" name="fpAddress" value={watchedValues.fpAddress || ""} error={errors.fpAddress} register={register} readOnly={isReadOnly} />
                      <TextInput label="City" type="text" placeholder="Please enter 1 or more characters" name="fpCity" value={watchedValues.fpCity || ""} error={errors.fpCity} register={register} readOnly={isReadOnly} />
                      <TextInput label="State" type="text" placeholder="" name="fpState" value={watchedValues.fpState || ""} error={errors.fpState} register={register} readOnly={isReadOnly} />
                      <TextInput label="Country" type="text" placeholder="" name="fpCountry" value={watchedValues.fpCountry || ""} error={errors.fpCountry} register={register} readOnly={isReadOnly} />
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="Zip code" type="text" placeholder="" name="fpZipCode" value={watchedValues.fpZipCode || ""} error={errors.fpZipCode} register={register} readOnly={isReadOnly} />
                      <TextInput label="Phone" type="text" placeholder="" name="fpPhone" value={watchedValues.fpPhone || ""} error={errors.fpPhone} register={register} readOnly={isReadOnly} />
                      <TextInput label="Fax" type="text" placeholder="" name="fpFax" value={watchedValues.fpFax || ""} error={errors.fpFax} register={register} readOnly={isReadOnly} />
                      <TextInput label="Email" type="email" placeholder="" name="fpEmail" value={watchedValues.fpEmail || ""} error={errors.fpEmail} register={register} readOnly={isReadOnly} />
                      <TextInput label="Website" type="text" placeholder="" name="fpWebsite" value={watchedValues.fpWebsite || ""} error={errors.fpWebsite} register={register} readOnly={isReadOnly} />
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mt-4">
                      <TextInput label="Contact person" type="text" placeholder="" name="fpContactPerson" value={watchedValues.fpContactPerson || ""} error={errors.fpContactPerson} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>

                  {/* Invoice Payable To */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Invoice Payable To
                      <label className="flex items-center gap-1 font-normal cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={watchedValues.ipSameAsCarrier || false}
                          onChange={(e) =>
                            setValue("ipSameAsCarrier", e.target.checked, { shouldDirty: true })
                          }
                          disabled={isReadOnly}
                        />
                        <span>Same as carrier Address</span>
                      </label>
                    </legend>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
                      <TextInput label="Name" type="text" placeholder="" name="ipName" value={watchedValues.ipName || ""} error={errors.ipName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Address" type="text" placeholder="Please enter 1 or more characters" name="ipAddress" value={watchedValues.ipAddress || ""} error={errors.ipAddress} register={register} readOnly={isReadOnly} />
                      <TextInput label="City" type="text" placeholder="Please enter 1 or more characters" name="ipCity" value={watchedValues.ipCity || ""} error={errors.ipCity} register={register} readOnly={isReadOnly} />
                      <TextInput label="State" type="text" placeholder="" name="ipState" value={watchedValues.ipState || ""} error={errors.ipState} register={register} readOnly={isReadOnly} />
                      <TextInput label="Zip code" type="text" placeholder="" name="ipZipCode" value={watchedValues.ipZipCode || ""} error={errors.ipZipCode} register={register} readOnly={isReadOnly} />
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="Phone" type="text" placeholder="" name="ipPhone" value={watchedValues.ipPhone || ""} error={errors.ipPhone} register={register} readOnly={isReadOnly} />
                      <TextInput label="Fax" type="text" placeholder="" name="ipFax" value={watchedValues.ipFax || ""} error={errors.ipFax} register={register} readOnly={isReadOnly} />
                      <TextInput label="Email" type="email" placeholder="" name="ipEmail" value={watchedValues.ipEmail || ""} error={errors.ipEmail} register={register} readOnly={isReadOnly} />
                      <TextInput label="Website" type="text" placeholder="" name="ipWebsite" value={watchedValues.ipWebsite || ""} error={errors.ipWebsite} register={register} readOnly={isReadOnly} />
                      <TextInput label="Contact person" type="text" placeholder="" name="ipContactPerson" value={watchedValues.ipContactPerson || ""} error={errors.ipContactPerson} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>

                  {/* Remit Details */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Remit Details
                      <label className="flex items-center gap-1 font-normal cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={watchedValues.rdSameAsCarrier || false}
                          onChange={(e) =>
                            setValue("rdSameAsCarrier", e.target.checked, { shouldDirty: true })
                          }
                          disabled={isReadOnly}
                        />
                        <span>Same as carrier Address</span>
                      </label>
                    </legend>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
                      <TextInput label="Remit name" type="text" placeholder="" name="remitName" value={watchedValues.remitName || ""} error={errors.remitName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Remit address" type="text" placeholder="Please enter 1 or more characters" name="remitAddress" value={watchedValues.remitAddress || ""} error={errors.remitAddress} register={register} readOnly={isReadOnly} />
                      <TextInput label="Remit state 2" type="text" placeholder="" name="remitState2" value={watchedValues.remitState2 || ""} error={errors.remitState2} register={register} readOnly={isReadOnly} />
                      <TextInput label="City" type="text" placeholder="" name="remitCity" value={watchedValues.remitCity || ""} error={errors.remitCity} register={register} readOnly={isReadOnly} />
                      <TextInput label="Country" type="text" placeholder="" name="remitCountry" value={watchedValues.remitCountry || ""} error={errors.remitCountry} register={register} readOnly={isReadOnly} />
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                      <TextInput label="Remit zip code" type="text" placeholder="" name="remitZipCode" value={watchedValues.remitZipCode || ""} error={errors.remitZipCode} register={register} readOnly={isReadOnly} />
                      <TextInput label="Remit phone" type="text" placeholder="" name="remitPhone" value={watchedValues.remitPhone || ""} error={errors.remitPhone} register={register} readOnly={isReadOnly} />
                      <TextInput label="Remit fax" type="text" placeholder="" name="remitFax" value={watchedValues.remitFax || ""} error={errors.remitFax} register={register} readOnly={isReadOnly} />
                      <TextInput label="Email" type="email" placeholder="" name="remitEmail" value={watchedValues.remitEmail || ""} error={errors.remitEmail} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>

                  {/* Dispatch Details */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Dispatch Details
                    </legend>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="Dispatch contact name" type="text" placeholder="" name="dispatchContactName" value={watchedValues.dispatchContactName || ""} error={errors.dispatchContactName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Dispatch email" type="email" placeholder="" name="dispatchEmail" value={watchedValues.dispatchEmail || ""} error={errors.dispatchEmail} register={register} readOnly={isReadOnly} />
                      <TextInput label="Dispatch phone1" type="text" placeholder="" name="dispatchPhone1" value={watchedValues.dispatchPhone1 || ""} error={errors.dispatchPhone1} register={register} readOnly={isReadOnly} />
                      <TextInput label="Dispatch phone2" type="text" placeholder="" name="dispatchPhone2" value={watchedValues.dispatchPhone2 || ""} error={errors.dispatchPhone2} register={register} readOnly={isReadOnly} />
                      <TextInput label="Dispatch phone3" type="text" placeholder="" name="dispatchPhone3" value={watchedValues.dispatchPhone3 || ""} error={errors.dispatchPhone3} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>

                  {/* NetSuite Details */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      NetSuite Details
                    </legend>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                      <TextInput label="NetSuite Subsidiary Name" type="text" placeholder="" name="netSuiteSubsidiaryName" value={watchedValues.netSuiteSubsidiaryName || ""} error={errors.netSuiteSubsidiaryName} register={register} readOnly={isReadOnly} />
                      <TextInput label="NetSuite 1099 Account#" type="text" placeholder="" name="netSuite1099AccountNumber" value={watchedValues.netSuite1099AccountNumber || ""} error={errors.netSuite1099AccountNumber} register={register} readOnly={isReadOnly} />
                      <TextInput label="Purchase ExpenseLine Account" type="text" placeholder="" name="purchaseExpenseLineAccount" value={watchedValues.purchaseExpenseLineAccount || ""} error={errors.purchaseExpenseLineAccount} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>
                </div>
              )}

              {/* ── Step 4: Modes & Certification ── */}
              {stepNumber === 3 && (
                <div className="space-y-5 pt-4">
                  {/* Modes */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Modes
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5">
                      {sw("modeLTL", "Less Than Truck Load")}
                      {sw("modePartial", "Partial")}
                      {sw("modeTruckLoad", "Truck load")}
                      {sw("modeRail", "Rail")}
                      {sw("modeIntermodal", "Intermodal")}
                      {sw("modeAir", "Air")}
                      {sw("modeExpedite", "Expedite")}
                      {sw("modeOcean", "Ocean")}
                    </div>
                  </fieldset>

                  {/* Carrier Certification */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Carrier Certification
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <TextInput label="HazmatNumber" type="text" placeholder="" name="hazmatNumber" value={watchedValues.hazmatNumber || ""} error={errors.hazmatNumber} register={register} readOnly={isReadOnly} />
                      <TextInput label="CTPATSVI Number" type="text" placeholder="" name="ctpatsvINumber" value={watchedValues.ctpatsvINumber || ""} error={errors.ctpatsvINumber} register={register} readOnly={isReadOnly} />
                      <TextInput label="Tanker Endorsed Num Of Drivers" type="text" placeholder="" name="tankerEndorsedNumOfDrivers" value={watchedValues.tankerEndorsedNumOfDrivers || ""} error={errors.tankerEndorsedNumOfDrivers} register={register} readOnly={isReadOnly} />
                      {sw("hazmat", "Hazmat")}
                      {sw("smartWay", "SmartWay")}
                      {sw("carb", "CARB")}
                    </div>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5">
                      {sw("twic", "TWIC")}
                      {sw("ctpatCertified", "CTPAT Certified")}
                      {sw("tankerEndorsed", "Tanker Endorsed")}
                    </div>
                  </fieldset>

                  {/* Class */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Class
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5">
                      {sw("classConestoga", "Conestoga")}
                      {sw("classContainers", "Containers")}
                      {sw("classDecksSpecialized", "Decks Specialized")}
                      {sw("classDecksStandard", "Decks Standard")}
                      {sw("classDryBulk", "Dry Bulk")}
                      {sw("classFlatBeds", "Flat beds")}
                      {sw("classHazardousMaterials", "Hazardous Materials")}
                      {sw("classReefers", "Reefers")}
                      {sw("classTankers", "Tankers")}
                      {sw("classVansSpecialized", "Vans Specialized")}
                      {sw("classVansStandard", "Vans Standard")}
                      <div className="flex flex-col gap-1">
                        {sw("classOther", "Other")}
                        {watchedValues.classOther && (
                          <TextInput
                            label=""
                            type="text"
                            placeholder="Specify..."
                            name="classOtherText"
                            value={watchedValues.classOtherText || ""}
                            error={errors.classOtherText}
                            register={register}
                            readOnly={isReadOnly}
                          />
                        )}
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}

              {/* ── Step 5: Fleet & Banking ── */}
              {stepNumber === 4 && (
                <div className="space-y-5 pt-4">
                  {/* Fleet */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Fleet
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="FleetSize" type="text" placeholder="" name="fleetSize" value={watchedValues.fleetSize || ""} error={errors.fleetSize} register={register} readOnly={isReadOnly} />
                      <TextInput label="Total Power Units" type="text" placeholder="" name="totalPowerUnits" value={watchedValues.totalPowerUnits || ""} error={errors.totalPowerUnits} register={register} readOnly={isReadOnly} />
                      <TextInput label="Number Of Vehicles" type="text" placeholder="" name="numberOfVehicles" value={watchedValues.numberOfVehicles || ""} error={errors.numberOfVehicles} register={register} readOnly={isReadOnly} />
                      {sw("reeferEquipment", "Reefer Equipment")}
                      {sw("vanEquipment", "Van Equipment")}
                      {sw("flatbedStepDeckEquipment", "Flatbed StepDeck Equipment")}
                    </div>
                  </fieldset>

                  {/* Remit Bank Info */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Remit Bank Info
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <TextInput label="Carrier Bank Routing Number" type="text" placeholder="" name="carrierBankRoutingNumber" value={watchedValues.carrierBankRoutingNumber || ""} error={errors.carrierBankRoutingNumber} register={register} readOnly={isReadOnly} />
                      <TextInput label="Carrier Bank Account Number" type="text" placeholder="" name="carrierBankAccountNumber" value={watchedValues.carrierBankAccountNumber || ""} error={errors.carrierBankAccountNumber} register={register} readOnly={isReadOnly} />
                      <TextInput label="Carrier Bank Account Name" type="text" placeholder="" name="carrierBankAccountName" value={watchedValues.carrierBankAccountName || ""} error={errors.carrierBankAccountName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Carrier Bank Name" type="text" placeholder="" name="carrierBankName" value={watchedValues.carrierBankName || ""} error={errors.carrierBankName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Carrier Bank Address" type="text" placeholder="" name="carrierBankAddress" value={watchedValues.carrierBankAddress || ""} error={errors.carrierBankAddress} register={register} readOnly={isReadOnly} />
                      <TextInput label="Carrier Bank Phone" type="text" placeholder="" name="carrierBankPhone" value={watchedValues.carrierBankPhone || ""} error={errors.carrierBankPhone} register={register} readOnly={isReadOnly} />
                    </div>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="Carrier Bank Fax" type="text" placeholder="" name="carrierBankFax" value={watchedValues.carrierBankFax || ""} error={errors.carrierBankFax} register={register} readOnly={isReadOnly} />
                      <CustomSelectRadix
                        label="Carrier Bank Account Type"
                        name="carrierBankAccountType"
                        options={BANK_ACCOUNT_TYPE_OPTIONS}
                        control={control}
                        error={errors.carrierBankAccountType}
                        placeholder="Select"
                        disabled={isReadOnly}
                        isSearchable={false}
                      />
                    </div>
                  </fieldset>

                  {/* Agreement */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Agreement
                    </legend>
                    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5">
                      <TextInput label="Signature Date" type="date" name="signatureDate" value={watchedValues.signatureDate || ""} error={errors.signatureDate} register={register} readOnly={isReadOnly} />
                      <TextInput label="Signature Person" type="text" placeholder="" name="signaturePerson" value={watchedValues.signaturePerson || ""} error={errors.signaturePerson} register={register} readOnly={isReadOnly} />
                      <TextInput label="Signature Person Title" type="text" placeholder="" name="signaturePersonTitle" value={watchedValues.signaturePersonTitle || ""} error={errors.signaturePersonTitle} register={register} readOnly={isReadOnly} />
                      <TextInput label="Signature Person UserName" type="text" placeholder="" name="signaturePersonUserName" value={watchedValues.signaturePersonUserName || ""} error={errors.signaturePersonUserName} register={register} readOnly={isReadOnly} />
                      <TextInput label="Signature Person Phone Number" type="text" placeholder="" name="signaturePersonPhoneNumber" value={watchedValues.signaturePersonPhoneNumber || ""} error={errors.signaturePersonPhoneNumber} register={register} readOnly={isReadOnly} />
                      {sw("isActive", "IsActive")}
                    </div>
                  </fieldset>

                  {/* Bill To */}
                  <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                    <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                      Bill To
                    </legend>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                      <TextInput label="Email" type="email" placeholder="" name="billToEmail" value={watchedValues.billToEmail || ""} error={errors.billToEmail} register={register} readOnly={isReadOnly} />
                      <TextInput label="Address" type="text" placeholder="" name="billToAddress" value={watchedValues.billToAddress || ""} error={errors.billToAddress} register={register} readOnly={isReadOnly} />
                      <TextInput label="Instructions" type="text" placeholder="" name="billToInstructions" value={watchedValues.billToInstructions || ""} error={errors.billToInstructions} register={register} readOnly={isReadOnly} />
                    </div>
                  </fieldset>
                </div>
              )}
            </div>

            {/* Form Actions — identical pattern to VehiclesTMS */}
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
                          stepNumber === CARRIER_FORM_STEPS.length - 1
                            ? "Close"
                            : "Next"
                        }
                        className="btn-dark"
                        onClick={
                          stepNumber === CARRIER_FORM_STEPS.length - 1
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
                        stepNumber === CARRIER_FORM_STEPS.length - 1 &&
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
    </div>
  );
};

export default CarriersTMS;