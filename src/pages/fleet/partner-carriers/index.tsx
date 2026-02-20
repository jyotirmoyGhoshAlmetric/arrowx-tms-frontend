import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import { toast } from "react-toastify";
import {
  VEHICLE_CLASS_ID_OPTIONS,
  VEHICLE_TAX_TYPE_OPTIONS,
} from "./helper/constants";
import InputGroup from "@/components/ui/InputGroup";
import { CELL_COUNTRY_CODES } from "../drivers/helper/constants";

// ─── Constants ────────────────────────────────────────────────────────────────

export const PARTNER_CARRIER_FORM_STEPS = [
  { id: 1, title: "Partner Carrier Details" },
  { id: 2, title: "Accounting" },
];

const PAY_METHOD_OPTIONS = [
  { value: "none", label: "None" },
  { value: "check", label: "Check" },
  { value: "ach", label: "ACH" },
  { value: "wire", label: "Wire" },
  { value: "comcheck", label: "Comcheck" },
];

const BOX_1099_OPTIONS = [
  { value: "box1", label: "Box 1" },
  { value: "box2", label: "Box 2" },
  { value: "box3", label: "Box 3" },
  // TODO: populate from API
];

// ─── Validation Schema ────────────────────────────────────────────────────────

const partnerCarrierValidationSchema = Yup.object().shape({
  // Step 1 - Partner Carrier Details
  freezePay: Yup.boolean(),
  nameCompany: Yup.string().required("Name/Company is required"),
  contactPerson: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  einNumber: Yup.string().nullable(),
  hst: Yup.string().nullable(),
  cellPhone: Yup.string().nullable(),
  address: Yup.string().required("Address is required"),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  zipCode: Yup.string().nullable(),
  loadStopTenancyName: Yup.string().nullable(),
  payMethod: Yup.string().required("Pay method is required"),
  status: Yup.boolean(),
  manageSettlements: Yup.boolean(),
  // Step 2 - Accounting
  vendorId: Yup.string().nullable(),
  classId: Yup.string().nullable(),
  taxType: Yup.string().nullable(),
  box1099: Yup.string().nullable(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit" | "view";

// ─── Component ────────────────────────────────────────────────────────────────

const PartnerCarrierTMS: React.FC = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
  } = useForm<any>({
    resolver: yupResolver(partnerCarrierValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      // Step 1
      freezePay: false,
      nameCompany: "",
      contactPerson: "",
      email: "",
      einNumber: "",
      hst: "",
      cellPhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      loadStopTenancyName: "",
      payMethod: "none",
      status: true,
      manageSettlements: false,
      // Step 2
      vendorId: "",
      classId: "",
      taxType: "",
      box1099: "",
    },
  });

  const watchedValues = watch();
  const isReadOnly = modalMode === "view";

  // Modal close handler
  const handleModalClose = useCallback(async () => {
    setShowModal(false);
    setModalMode("add");
    setStepNumber(0);
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  // Handle adding new partner carrier
  const handleAdd = useCallback(() => {
    setModalMode("add");
    setStepNumber(0);
    reset();
    setShowModal(true);
  }, [reset]);

  // Handle previous step
  const handlePrev = useCallback(() => {
    setStepNumber((prev) => prev - 1);
  }, []);

  // Submit / next step handler
  const onSubmit = useCallback(
    async (data: any) => {
      const totalSteps = PARTNER_CARRIER_FORM_STEPS.length;
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
      console.log("Partner carrier form submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Partner carrier created successfully"
          : "Partner carrier updated successfully",
      );
      reset();
      setShowModal(false);
      setModalMode("add");
      setStepNumber(0);
    },
    [stepNumber, modalMode, trigger, clearErrors, handleModalClose, reset],
  );

  // Modal config per mode and step
  const getModalConfig = useCallback(() => {
    const configs = {
      add: {
        title: "Create new Partner Carrier",
        submitText:
          stepNumber !== PARTNER_CARRIER_FORM_STEPS.length - 1
            ? "Next"
            : "Save",
      },
      edit: {
        title: "Edit Partner Carrier",
        submitText:
          stepNumber !== PARTNER_CARRIER_FORM_STEPS.length - 1
            ? "Next"
            : "Update",
      },
      view: {
        title: "Partner Carrier Details",
        submitText:
          stepNumber !== PARTNER_CARRIER_FORM_STEPS.length - 1
            ? "Next"
            : "Close",
      },
    };
    return configs[modalMode];
  }, [modalMode, stepNumber]);

  const modalConfig = getModalConfig();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Partner Carriers
        </h2>
        <Button
          text="Add Partner Carrier"
          className="btn-dark"
          onClick={handleAdd}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Partner Carrier Modal */}
      <Modal
        centered
        className="max-w-4xl"
        title={modalConfig.title}
        activeModal={showModal}
        onClose={handleModalClose}
      >
        {/* Progress Steps — same pattern as VehiclesTMS */}
        <div className="flex z-5 items-center relative justify-center md:mx-8 mb-10">
          {PARTNER_CARRIER_FORM_STEPS.map((item, i) => (
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
                } absolute top-1/2 h-[2px] w-full`}
              />

              <div
                className={`${
                  stepNumber >= i
                    ? "text-slate-900 dark:text-slate-300"
                    : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100 whitespace-nowrap`}
              >
                <span className="w-max">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[55vh] overflow-y-auto px-1 pt-2 overscroll-contain">
              {/* ── Step 1: Partner Carrier Details ── */}
              {stepNumber === 0 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  {/* Freeze Pay — full row */}
                  <div className="lg:col-span-3 md:col-span-2">
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
                  </div>

                  {/* Name/Company | Contact person | Email | EIN Number */}
                  <TextInput
                    label="Name/Company"
                    type="text"
                    placeholder="Name/Company"
                    name="nameCompany"
                    value={watchedValues.nameCompany || ""}
                    error={errors.nameCompany}
                    register={register}
                    required
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="Contact person"
                    type="text"
                    placeholder="Contact person"
                    name="contactPerson"
                    value={watchedValues.contactPerson || ""}
                    error={errors.contactPerson}
                    register={register}
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={watchedValues.email || ""}
                    error={errors.email}
                    register={register}
                    required
                    readOnly={isReadOnly}
                  />

                  {/* EIN Number | HST# | Cell phone */}
                  <TextInput
                    label="EIN Number"
                    type="text"
                    placeholder="Enter EIN Number"
                    name="einNumber"
                    value={watchedValues.einNumber || ""}
                    error={errors.einNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="HST#"
                    type="text"
                    placeholder="Enter HST Number"
                    name="hst"
                    value={watchedValues.hst || ""}
                    error={errors.hst}
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

                  {/* Address | City | State | Zip code */}
                  <TextInput
                    label="Address"
                    type="text"
                    placeholder="Enter address"
                    name="address"
                    value={watchedValues.address || ""}
                    error={errors.address}
                    register={register}
                    required
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="City"
                    type="text"
                    placeholder="Enter city"
                    name="city"
                    value={watchedValues.city || ""}
                    error={errors.city}
                    register={register}
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="State"
                    type="text"
                    placeholder="Enter state"
                    name="state"
                    value={watchedValues.state || ""}
                    error={errors.state}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  {/* LoadStop Tenancy name | Pay Method */}
                  <TextInput
                    label="Zip code"
                    type="text"
                    placeholder="Enter zip code"
                    name="zipCode"
                    value={watchedValues.zipCode || ""}
                    error={errors.zipCode}
                    register={register}
                    readOnly={isReadOnly}
                  />
                  <TextInput
                    label="LoadStop Tenancy name"
                    type="text"
                    placeholder="Enter LoadStop Tenancy name"
                    name="loadStopTenancyName"
                    value={watchedValues.loadStopTenancyName || ""}
                    error={errors.loadStopTenancyName}
                    register={register}
                    readOnly={isReadOnly}
                  />
                  <CustomSelectRadix
                    label="Pay Method"
                    name="payMethod"
                    options={PAY_METHOD_OPTIONS}
                    control={control}
                    error={errors.payMethod}
                    placeholder="None"
                    disabled={isReadOnly}
                    isSearchable={false}
                    required
                  />

                  {/* Status | Manage Settlements toggles */}
                  <div className="lg:col-span-3 md:col-span-2 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5">
                    <Switch
                      name="status"
                      label="Status"
                      value={watchedValues.status ?? true}
                      onChange={(e) =>
                        setValue("status", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                      description="Toggle off to deactivate this partner carrier"
                    />
                    <Switch
                      name="manageSettlements"
                      label="Manage Settlements"
                      value={watchedValues.manageSettlements || false}
                      onChange={(e) =>
                        setValue("manageSettlements", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Accounting ── */}
              {stepNumber === 1 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <TextInput
                    label="Vendor Id"
                    type="text"
                    placeholder="Enter vendor id"
                    name="vendorId"
                    value={watchedValues.vendorId || ""}
                    error={errors.vendorId}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Class Id"
                    name="classId"
                    options={VEHICLE_CLASS_ID_OPTIONS}
                    control={control}
                    error={errors.classId}
                    placeholder="Select"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <CustomSelectRadix
                    label="Tax Type"
                    name="taxType"
                    options={VEHICLE_TAX_TYPE_OPTIONS}
                    control={control}
                    error={errors.taxType}
                    placeholder="Select"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <CustomSelectRadix
                    label="1099 Box"
                    name="box1099"
                    options={BOX_1099_OPTIONS}
                    control={control}
                    error={errors.box1099}
                    placeholder="Select"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />
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
                          stepNumber === PARTNER_CARRIER_FORM_STEPS.length - 1
                            ? "Close"
                            : "Next"
                        }
                        className="btn-dark"
                        onClick={
                          stepNumber === PARTNER_CARRIER_FORM_STEPS.length - 1
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
                        stepNumber === PARTNER_CARRIER_FORM_STEPS.length - 1 &&
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

export default PartnerCarrierTMS;
