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
import {
  US_STATES,
  LEASE_VENDOR_OPTIONS,
  VEHICLE_TAX_TYPE_OPTIONS,
  VEHICLE_CLASS_ID_OPTIONS,
  TRAILER_FORM_STEPS,
  TRAILER_TYPE_OPTIONS,
  TRAILER_LENGTH_OPTIONS,
  TERMINAL_OPTIONS,
  CARRIER_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  TRAILER_STATUS_OPTIONS,
} from "./helper/constants";
import { trailerValidationSchema } from "./helper/validationSchema";
import { SUBLEASE_DRIVER_OPTIONS } from "../vehicles/helper/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit" | "view";

interface LeaseVendorForm {
  name: string;
  vendorId: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax: string;
  email: string;
  status: boolean;
  accountingVendorId: string;
  classId: string;
  taxType: string;
  box1099: string;
}

const defaultLeaseVendorForm: LeaseVendorForm = {
  name: "",
  vendorId: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  fax: "",
  email: "",
  status: true,
  accountingVendorId: "",
  classId: "",
  taxType: "",
  box1099: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

const TrailersTMS: React.FC = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [showLeaseVendorModal, setShowLeaseVendorModal] = useState(false);
  const [leaseVendorForm, setLeaseVendorForm] =
    useState<LeaseVendorForm>(defaultLeaseVendorForm);

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
    resolver: yupResolver(trailerValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      // Step 1
      trailerNumber: "",
      trailerType: "van",
      length: "53",
      height: "",
      terminal: "default",
      carrier: "",
      vin: "",
      licenseNumber: "",
      licenseState: "",
      licenseExp: "",
      make: "",
      model: "",
      year: "",
      inspectionExp: "",
      registrationNumber: "",
      contractType: "",
      inServiceFrom: "",
      sourceReference: "",
      integrationId: "",
      monthlyCost: "0",
      trailerStatus: "",
      notes: "",
      status: true,
      doNotUse: false,
      onHold: false,
      // Step 2
      payableName: "",
      einNumber: "",
      payableEmail: "",
      payableAddress: "",
      payableCity: "",
      payableState: "",
      payableZipCode: "",
      // Step 3
      isLeased: false,
      leaseStartDate: "",
      leaseExpiryDate: "",
      leaseCompanyVendor: "",
      isSubleased: false,
      subleaseDriver: "",
      soldDate: "",
      soldPrice: "",
    },
  });

  const watchedValues = watch();
  const isReadOnly = modalMode === "view";

  // Modal close handler
  const handleModalClose = useCallback(async () => {
    setShowTrailerModal(false);
    setModalMode("add");
    setStepNumber(0);
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  // Handle adding new trailer
  const handleAddTrailer = useCallback(() => {
    setModalMode("add");
    setStepNumber(0);
    reset();
    setShowTrailerModal(true);
  }, [reset]);

  // Handle previous step
  const handlePrev = useCallback(() => {
    setStepNumber((prev) => prev - 1);
  }, []);

  // Submit / next step handler
  const onSubmit = useCallback(
    async (data: any) => {
      const totalSteps = TRAILER_FORM_STEPS.length;
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
      console.log("Trailer form submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Trailer added successfully"
          : "Trailer updated successfully",
      );
      reset();
      setShowTrailerModal(false);
      setModalMode("add");
      setStepNumber(0);
    },
    [stepNumber, modalMode, trigger, clearErrors, handleModalClose, reset],
  );

  // Modal config per mode and step
  const getModalConfig = useCallback(() => {
    const configs = {
      add: {
        title: "Add New Trailer",
        submitText:
          stepNumber !== TRAILER_FORM_STEPS.length - 1 ? "Next" : "Add Trailer",
      },
      edit: {
        title: "Edit Trailer",
        submitText:
          stepNumber !== TRAILER_FORM_STEPS.length - 1
            ? "Next"
            : "Update Trailer",
      },
      view: {
        title: "Trailer Details",
        submitText:
          stepNumber !== TRAILER_FORM_STEPS.length - 1 ? "Next" : "Close",
      },
    };
    return configs[modalMode];
  }, [modalMode, stepNumber]);

  const modalConfig = getModalConfig();

  // Lease vendor modal close
  const handleLeaseVendorModalClose = useCallback(() => {
    setShowLeaseVendorModal(false);
    setLeaseVendorForm(defaultLeaseVendorForm);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Trailers
        </h2>
        <Button
          text="Add Trailer"
          className="btn-dark"
          onClick={handleAddTrailer}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Trailer Modal */}
      <Modal
        centered
        className="max-w-4xl"
        title={modalConfig.title}
        activeModal={showTrailerModal}
        onClose={handleModalClose}
      >
        {/* Progress Steps — same pattern as VehiclesTMS */}
        <div className="flex z-5 items-center relative justify-center md:mx-8 mb-10">
          {TRAILER_FORM_STEPS.map((item, i) => (
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

              {/* ── Step 1: Trailer Details ── */}
              {stepNumber === 0 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <TextInput
                    label="Number"
                    type="text"
                    placeholder="Trailer number"
                    name="trailerNumber"
                    value={watchedValues.trailerNumber}
                    error={errors.trailerNumber}
                    register={register}
                    required
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Trailer Type"
                    name="trailerType"
                    options={TRAILER_TYPE_OPTIONS}
                    control={control}
                    error={errors.trailerType}
                    placeholder="Select Type"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <CustomSelectRadix
                    label="Length"
                    name="length"
                    options={TRAILER_LENGTH_OPTIONS}
                    control={control}
                    error={errors.length}
                    placeholder="Select Length"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <TextInput
                    label="Height"
                    type="text"
                    placeholder="Height"
                    name="height"
                    value={watchedValues.height || ""}
                    error={errors.height}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Terminal"
                    name="terminal"
                    options={TERMINAL_OPTIONS}
                    control={control}
                    error={errors.terminal}
                    placeholder="Select Terminal"
                    disabled={isReadOnly}
                    isSearchable={true}
                    required
                  />

                  <CustomSelectRadix
                    label="Carrier"
                    name="carrier"
                    options={CARRIER_OPTIONS}
                    control={control}
                    error={errors.carrier}
                    placeholder="Select Carrier"
                    disabled={isReadOnly}
                    isSearchable={true}
                    required
                  />

                  <TextInput
                    label="VIN"
                    type="text"
                    placeholder="VIN"
                    name="vin"
                    value={watchedValues.vin || ""}
                    error={errors.vin}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="License Number"
                    type="text"
                    placeholder="License number"
                    name="licenseNumber"
                    value={watchedValues.licenseNumber || ""}
                    error={errors.licenseNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="License State"
                    name="licenseState"
                    options={US_STATES}
                    control={control}
                    error={errors.licenseState}
                    placeholder="Select State"
                    disabled={isReadOnly}
                    isSearchable={true}
                  />

                  <TextInput
                    label="License Exp"
                    type="date"
                    name="licenseExp"
                    value={watchedValues.licenseExp || ""}
                    error={errors.licenseExp}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Make"
                    type="text"
                    placeholder="Make"
                    name="make"
                    value={watchedValues.make || ""}
                    error={errors.make}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Model"
                    type="text"
                    placeholder="Model"
                    name="model"
                    value={watchedValues.model || ""}
                    error={errors.model}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Year"
                    type="number"
                    placeholder="0"
                    name="year"
                    value={watchedValues.year || ""}
                    error={errors.year}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Inspection Exp"
                    type="date"
                    name="inspectionExp"
                    value={watchedValues.inspectionExp || ""}
                    error={errors.inspectionExp}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Registration Number"
                    type="text"
                    placeholder="Registration number"
                    name="registrationNumber"
                    value={watchedValues.registrationNumber || ""}
                    error={errors.registrationNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Contract Type"
                    name="contractType"
                    options={CONTRACT_TYPE_OPTIONS}
                    control={control}
                    error={errors.contractType}
                    placeholder="Select Contract Type"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <TextInput
                    label="In Service From"
                    type="date"
                    name="inServiceFrom"
                    value={watchedValues.inServiceFrom || ""}
                    error={errors.inServiceFrom}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Source Reference"
                    type="text"
                    placeholder="Source reference"
                    name="sourceReference"
                    value={watchedValues.sourceReference || ""}
                    error={errors.sourceReference}
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

                  <TextInput
                    label="Monthly Cost"
                    type="number"
                    placeholder="0"
                    name="monthlyCost"
                    value={watchedValues.monthlyCost || ""}
                    error={errors.monthlyCost}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <CustomSelectRadix
                    label="Trailer Status"
                    name="trailerStatus"
                    options={TRAILER_STATUS_OPTIONS}
                    control={control}
                    error={errors.trailerStatus}
                    placeholder="Select Option"
                    disabled={isReadOnly}
                    isSearchable={false}
                  />

                  <div className="lg:col-span-3 md:col-span-2">
                    <TextInput
                      label="Notes"
                      type="text"
                      placeholder="Notes"
                      name="notes"
                      value={watchedValues.notes || ""}
                      error={errors.notes}
                      register={register}
                      readOnly={isReadOnly}
                    />
                  </div>

                  {/* Status toggles */}
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
                      description="Toggle off to deactivate this trailer"
                    />
                    <Switch
                      name="doNotUse"
                      label="Do Not Use"
                      value={watchedValues.doNotUse || false}
                      onChange={(e) =>
                        setValue("doNotUse", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                    <Switch
                      name="onHold"
                      label="On Hold"
                      value={watchedValues.onHold || false}
                      onChange={(e) =>
                        setValue("onHold", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Payable To ── */}
              {stepNumber === 1 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <CustomSelectRadix
                    label="Name/Company"
                    name="payableName"
                    options={[]} // TODO: populate from API
                    control={control}
                    error={errors.payableName}
                    placeholder="Select Payable To"
                    disabled={isReadOnly}
                    isSearchable={true}
                  />

                  <TextInput
                    label="EIN Number"
                    type="text"
                    placeholder="EIN number"
                    name="einNumber"
                    value={watchedValues.einNumber || ""}
                    error={errors.einNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="payableEmail"
                    value={watchedValues.payableEmail || ""}
                    error={errors.payableEmail}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Address"
                    type="text"
                    placeholder="Please enter 1 or more characters"
                    name="payableAddress"
                    value={watchedValues.payableAddress || ""}
                    error={errors.payableAddress}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="City"
                    type="text"
                    placeholder="City"
                    name="payableCity"
                    value={watchedValues.payableCity || ""}
                    error={errors.payableCity}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="State"
                    type="text"
                    placeholder="State"
                    name="payableState"
                    value={watchedValues.payableState || ""}
                    error={errors.payableState}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Zip Code"
                    type="text"
                    placeholder="Zip code"
                    name="payableZipCode"
                    value={watchedValues.payableZipCode || ""}
                    error={errors.payableZipCode}
                    register={register}
                    readOnly={isReadOnly}
                  />
                </div>
              )}

              {/* ── Step 3: Lease & Sold ── */}
              {stepNumber === 2 && (
                <div className="pt-4">
                  {/* Lease section */}
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                    <Switch
                      name="isLeased"
                      label="Is Leased"
                      value={watchedValues.isLeased || false}
                      onChange={(e) =>
                        setValue("isLeased", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    {watchedValues.isLeased ? (
                      <>
                        <div>
                          <CustomSelectRadix
                            label="Lease Company Vendor"
                            name="leaseCompanyVendor"
                            options={LEASE_VENDOR_OPTIONS}
                            required
                            control={control}
                            error={errors.leaseCompanyVendor}
                            placeholder="Select Lease Vendor"
                            disabled={isReadOnly}
                            isSearchable={true}
                          />
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => setShowLeaseVendorModal(true)}
                              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
                            >
                              +Create New
                            </button>
                          )}
                        </div>

                        <TextInput
                          label="Lease Start Date"
                          type="date"
                          name="leaseStartDate"
                          value={watchedValues.leaseStartDate || ""}
                          error={errors.leaseStartDate}
                          register={register}
                          readOnly={isReadOnly}
                        />

                        <TextInput
                          label="Lease Expiry Date"
                          type="date"
                          name="leaseExpiryDate"
                          value={watchedValues.leaseExpiryDate || ""}
                          error={errors.leaseExpiryDate}
                          register={register}
                          readOnly={isReadOnly}
                        />
                      </>
                    ) : (
                      <>
                        <div />
                        <div />
                        <div />
                      </>
                    )}

                    {/* Is Subleased + conditional driver */}
                    <Switch
                      name="isSubleased"
                      label="Is Subleased"
                      value={watchedValues.isSubleased || false}
                      onChange={(e) =>
                        setValue("isSubleased", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    {watchedValues.isSubleased && (
                      <CustomSelectRadix
                        label="Sublease Driver"
                        name="subleaseDriver"
                        options={SUBLEASE_DRIVER_OPTIONS}
                        control={control}
                        error={errors.subleaseDriver}
                        placeholder="Select Driver"
                        disabled={isReadOnly}
                        isSearchable={true}
                      />
                    )}
                  </div>

                  {/* Sold section */}
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-6">
                    <TextInput
                      label="Sold Date"
                      type="date"
                      name="soldDate"
                      value={watchedValues.soldDate || ""}
                      error={errors.soldDate}
                      register={register}
                      readOnly={isReadOnly}
                    />

                    <TextInput
                      label="Sold Price"
                      type="number"
                      placeholder="0"
                      name="soldPrice"
                      value={watchedValues.soldPrice || ""}
                      error={errors.soldPrice}
                      register={register}
                      readOnly={isReadOnly}
                    />
                  </div>
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
                          stepNumber === TRAILER_FORM_STEPS.length - 1
                            ? "Close"
                            : "Next"
                        }
                        className="btn-dark"
                        onClick={
                          stepNumber === TRAILER_FORM_STEPS.length - 1
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
                        stepNumber === TRAILER_FORM_STEPS.length - 1 &&
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

      {/* ── Create New Lease Vendor Modal ── */}
      <Modal
        centered
        className="max-w-2xl"
        title="Create New Vendor"
        activeModal={showLeaseVendorModal}
        onClose={handleLeaseVendorModalClose}
      >
        <div className="flex flex-col gap-5 pt-4">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            <TextInput
              label="Name"
              type="text"
              placeholder=""
              name="vendorName"
              value={leaseVendorForm.name}
              required
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <TextInput
              label="Vendor ID"
              type="text"
              placeholder=""
              name="vendorVendorId"
              value={leaseVendorForm.vendorId}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  vendorId: e.target.value,
                }))
              }
            />

            <TextInput
              label="Address"
              type="text"
              placeholder="Please enter 1 or more characters"
              name="vendorAddress"
              value={leaseVendorForm.address}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />

            <TextInput
              label="Address 2"
              type="text"
              placeholder=""
              name="vendorAddress2"
              value={leaseVendorForm.address2}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  address2: e.target.value,
                }))
              }
            />

            <TextInput
              label="City"
              type="text"
              placeholder="City"
              name="vendorCity"
              value={leaseVendorForm.city}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            />

            <TextInput
              label="State"
              type="text"
              placeholder=""
              name="vendorState"
              value={leaseVendorForm.state}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  state: e.target.value,
                }))
              }
            />

            <TextInput
              label="Zip Code"
              type="text"
              placeholder=""
              name="vendorZipCode"
              value={leaseVendorForm.zipCode}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  zipCode: e.target.value,
                }))
              }
            />

            <TextInput
              label="Phone"
              type="text"
              placeholder=""
              name="vendorPhone"
              value={leaseVendorForm.phone}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />

            <TextInput
              label="Fax"
              type="text"
              placeholder=""
              name="vendorFax"
              value={leaseVendorForm.fax}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  fax: e.target.value,
                }))
              }
            />

            <TextInput
              label="Email"
              type="email"
              placeholder=""
              name="vendorEmail"
              value={leaseVendorForm.email}
              onChange={(e) =>
                setLeaseVendorForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <div className="lg:col-span-3 md:col-span-2">
              <Switch
                name="vendorStatus"
                label="Status"
                value={leaseVendorForm.status}
                onChange={(e) =>
                  setLeaseVendorForm((prev) => ({
                    ...prev,
                    status: e.target.checked,
                  }))
                }
              />
            </div>
          </div>

          {/* Accounting sub-section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
              Accounting
            </p>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              <TextInput
                label="Vendor ID"
                type="text"
                placeholder=""
                name="accountingVendorId"
                value={leaseVendorForm.accountingVendorId}
                onChange={(e) =>
                  setLeaseVendorForm((prev) => ({
                    ...prev,
                    accountingVendorId: e.target.value,
                  }))
                }
              />

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Class ID
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leaseVendorForm.classId}
                  onChange={(e) =>
                    setLeaseVendorForm((prev) => ({
                      ...prev,
                      classId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  {VEHICLE_CLASS_ID_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Tax Type
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leaseVendorForm.taxType}
                  onChange={(e) =>
                    setLeaseVendorForm((prev) => ({
                      ...prev,
                      taxType: e.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  {VEHICLE_TAX_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  1099 Box
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leaseVendorForm.box1099}
                  onChange={(e) =>
                    setLeaseVendorForm((prev) => ({
                      ...prev,
                      box1099: e.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  {/* TODO: populate 1099 box options from API */}
                </select>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              text="Cancel"
              className="btn-outline-dark"
              type="button"
              onClick={handleLeaseVendorModalClose}
            />
            <Button
              text="Save"
              className="btn-primary"
              type="button"
              onClick={() => {
                // TODO: wire up save API
                console.log("New vendor:", leaseVendorForm);
                handleLeaseVendorModalClose();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrailersTMS;