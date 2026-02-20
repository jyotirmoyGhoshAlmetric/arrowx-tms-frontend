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
import { vehicleValidationSchema } from "./helper/validationSchema";
import {
  VEHICLE_FORM_STEPS,
  US_STATES,
  LEASE_VENDOR_OPTIONS,
  SUBLEASE_DRIVER_OPTIONS,
  VEHICLE_TAX_TYPE_OPTIONS,
  VEHICLE_CLASS_ID_OPTIONS,
} from "./helper/constants";

type ModalMode = "add" | "edit" | "view";

const VehiclesTMS: React.FC = () => {
  // State management
  const [stepNumber, setStepNumber] = useState(0);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [showLeaseVendorModal, setShowLeaseVendorModal] = useState(false);
  const [leaseVendorForm, setLeaseVendorForm] = useState({
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
    status: false,
    accountingVendorId: "",
    classId: "",
    taxType: "",
    box1099: "",
  });

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
    resolver: yupResolver(vehicleValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      // Step 1 - Vehicle Details
      vehicleNumber: "",
      licenseNumber: "",
      licenseState: "",
      assignedTo: "",
      vin: "",
      make: "",
      model: "",
      year: "",
      integrationId: "",
      notes: "",
      status: true,
      deactivationDate: "",
      deactivationReason: "",
      tankCapacity: "",
      averageMpg: "",
      defLevel: "",
      // Step 2 - Payable To
      payableName: "",
      einNumber: "",
      payableEmail: "",
      payableAddress: "",
      payableCity: "",
      payableState: "",
      payableZipCode: "",
      // Step 3 - Details
      startingMileage: "0",
      currentMileage: "0",
      mortgageCost: "0",
      annualInsuranceCost: "0",
      annualPlateCost: "0",
      insuranceRenewalDate: "",
      lastMaintenanceDate: "",
      inspectionExpiration: "",
      inServiceFrom: "",
      registrationDate: "",
      registrationExpiryDate: "",
      purchaseDate: "",
      purchasePrice: "",
      prepassNumber: "",
      ownerOperated: false,
      cameraInstalled: false,
      cameraSerialNumber: "",
      apuInstalled: false,
      // Step 4 - Lease & Sold
      isLeased: false,
      leaseCompanyVendor: "",
      leaseStartDate: "",
      leaseExpiryDate: "",
      warrantyExpirationDate: "",
      warrantyMileage: "",
      isSubleased: false,
      subleaseDriver: "",
      soldDate: "",
      soldPrice: "",
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
    setShowVehicleModal(false);
    setModalMode("add");
    setStepNumber(0);
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  // Handle adding new vehicle
  const handleAddVehicle = useCallback(() => {
    setModalMode("add");
    setStepNumber(0);
    reset();
    setShowVehicleModal(true);
  }, [reset]);

  // Handle previous step
  const handlePrev = useCallback(() => {
    setStepNumber((prev) => prev - 1);
  }, []);

  // Submit / next step handler
  const onSubmit = useCallback(
    async (data: any) => {
      const totalSteps = VEHICLE_FORM_STEPS.length;
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
      console.log("Vehicle form submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Vehicle added successfully"
          : "Vehicle updated successfully",
      );
      reset();
      setShowVehicleModal(false);
      setModalMode("add");
      setStepNumber(0);
    },
    [stepNumber, modalMode, trigger, clearErrors, handleModalClose, reset],
  );

  // Modal config per mode and step
  const getModalConfig = useCallback(() => {
    const configs = {
      add: {
        title: "Add New Vehicle",
        submitText:
          stepNumber !== VEHICLE_FORM_STEPS.length - 1 ? "Next" : "Add Vehicle",
      },
      edit: {
        title: "Edit Vehicle",
        submitText:
          stepNumber !== VEHICLE_FORM_STEPS.length - 1
            ? "Next"
            : "Update Vehicle",
      },
      view: {
        title: "Vehicle Details",
        submitText:
          stepNumber !== VEHICLE_FORM_STEPS.length - 1 ? "Next" : "Close",
      },
    };
    return configs[modalMode];
  }, [modalMode, stepNumber]);

  const modalConfig = getModalConfig();

  // Lease vendor modal close
  const handleLeaseVendorModalClose = useCallback(() => {
    setShowLeaseVendorModal(false);
    setLeaseVendorForm({
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
      status: false,
      accountingVendorId: "",
      classId: "",
      taxType: "",
      box1099: "",
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Vehicles
        </h2>
        <Button
          text="Add Vehicle"
          className="btn-dark"
          onClick={handleAddVehicle}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Vehicle Modal */}
      <Modal
        centered
        className="max-w-4xl"
        title={modalConfig.title}
        activeModal={showVehicleModal}
        onClose={handleModalClose}
      >
        {/* Progress Steps — same pattern as driverTMS */}
        <div className="flex z-5 items-center relative justify-center md:mx-8 mb-10">
          {VEHICLE_FORM_STEPS.map((item, i) => (
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
              {/* ── Step 1: Vehicle Details ── */}
              {stepNumber === 0 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <TextInput
                    label="Number"
                    type="text"
                    placeholder="Vehicle number"
                    name="vehicleNumber"
                    value={watchedValues.vehicleNumber}
                    error={errors.vehicleNumber}
                    register={register}
                    required
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
                    label="Tank Capacity"
                    type="number"
                    placeholder="0"
                    name="tankCapacity"
                    value={watchedValues.tankCapacity || ""}
                    error={errors.tankCapacity}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Average MPG"
                    type="number"
                    placeholder="0"
                    name="averageMpg"
                    value={watchedValues.averageMpg || ""}
                    error={errors.averageMpg}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="DEF Level"
                    type="number"
                    placeholder="0"
                    name="defLevel"
                    value={watchedValues.defLevel || ""}
                    error={errors.defLevel}
                    register={register}
                    readOnly={isReadOnly}
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

                  {/* Status toggle */}
                  <div className="lg:col-span-3 md:col-span-2">
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
                      description="Toggle off to deactivate this vehicle"
                    />
                  </div>

                  {/* Conditional deactivation fields */}
                  {!watchedValues.status && (
                    <>
                      <TextInput
                        label="Deactivation Date"
                        type="date"
                        name="deactivationDate"
                        value={watchedValues.deactivationDate || ""}
                        error={errors.deactivationDate}
                        register={register}
                        required
                        readOnly={isReadOnly}
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                      <div className="lg:col-span-2">
                        <TextInput
                          label="Deactivation Reason"
                          type="text"
                          placeholder="Enter deactivation reason"
                          name="deactivationReason"
                          value={watchedValues.deactivationReason || ""}
                          error={errors.deactivationReason}
                          register={register}
                          readOnly={isReadOnly}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Step 2: Payable To ── */}
              {stepNumber === 1 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <TextInput
                    label="Name/Company"
                    type="text"
                    placeholder="Name or company"
                    name="payableName"
                    value={watchedValues.payableName || ""}
                    error={errors.payableName}
                    register={register}
                    readOnly={isReadOnly}
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

                  <CustomSelectRadix
                    label="State"
                    name="payableState"
                    options={US_STATES}
                    control={control}
                    error={errors.payableState}
                    placeholder="Select State"
                    disabled={isReadOnly}
                    isSearchable={true}
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

              {/* ── Step 3: Details ── */}
              {stepNumber === 2 && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-4">
                  <TextInput
                    label="Starting Mileage"
                    type="number"
                    placeholder="0"
                    name="startingMileage"
                    value={watchedValues.startingMileage || ""}
                    error={errors.startingMileage}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Current Mileage"
                    type="number"
                    placeholder="0"
                    name="currentMileage"
                    value={watchedValues.currentMileage || ""}
                    error={errors.currentMileage}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Mortgage Cost"
                    type="number"
                    placeholder="0"
                    name="mortgageCost"
                    value={watchedValues.mortgageCost || ""}
                    error={errors.mortgageCost}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Annual Insurance Cost"
                    type="number"
                    placeholder="0"
                    name="annualInsuranceCost"
                    value={watchedValues.annualInsuranceCost || ""}
                    error={errors.annualInsuranceCost}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Annual Plate Cost"
                    type="number"
                    placeholder="0"
                    name="annualPlateCost"
                    value={watchedValues.annualPlateCost || ""}
                    error={errors.annualPlateCost}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Insurance Renewal Date"
                    type="date"
                    name="insuranceRenewalDate"
                    value={watchedValues.insuranceRenewalDate || ""}
                    error={errors.insuranceRenewalDate}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Last Maintenance Date"
                    type="date"
                    name="lastMaintenanceDate"
                    value={watchedValues.lastMaintenanceDate || ""}
                    error={errors.lastMaintenanceDate}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Inspection Expiration"
                    type="date"
                    name="inspectionExpiration"
                    value={watchedValues.inspectionExpiration || ""}
                    error={errors.inspectionExpiration}
                    register={register}
                    readOnly={isReadOnly}
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
                    label="Registration Date"
                    type="date"
                    name="registrationDate"
                    value={watchedValues.registrationDate || ""}
                    error={errors.registrationDate}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Registration Expiry Date"
                    type="date"
                    name="registrationExpiryDate"
                    value={watchedValues.registrationExpiryDate || ""}
                    error={errors.registrationExpiryDate}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Purchase Date"
                    type="date"
                    name="purchaseDate"
                    value={watchedValues.purchaseDate || ""}
                    error={errors.purchaseDate}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Purchase Price"
                    type="number"
                    placeholder="0"
                    name="purchasePrice"
                    value={watchedValues.purchasePrice || ""}
                    error={errors.purchasePrice}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  <TextInput
                    label="Prepass Number"
                    type="text"
                    placeholder="Prepass number"
                    name="prepassNumber"
                    value={watchedValues.prepassNumber || ""}
                    error={errors.prepassNumber}
                    register={register}
                    readOnly={isReadOnly}
                  />

                  {/* Toggles */}
                  <div className="lg:col-span-3 md:col-span-2 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5">
                    <Switch
                      name="ownerOperated"
                      label="Owner Operated"
                      value={watchedValues.ownerOperated || false}
                      onChange={(e) =>
                        setValue("ownerOperated", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    <Switch
                      name="cameraInstalled"
                      label="Camera Installed"
                      value={watchedValues.cameraInstalled || false}
                      onChange={(e) =>
                        setValue("cameraInstalled", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />

                    <Switch
                      name="apuInstalled"
                      label="APU Installed"
                      value={watchedValues.apuInstalled || false}
                      onChange={(e) =>
                        setValue("apuInstalled", e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isReadOnly}
                    />
                  </div>

                  {/* Camera Serial Number - full row below toggles */}
                  {watchedValues.cameraInstalled && (
                    <div className="lg:col-span-3 md:col-span-2">
                      <TextInput
                        label="Camera Serial Number"
                        type="text"
                        placeholder="Camera serial number"
                        name="cameraSerialNumber"
                        value={watchedValues.cameraSerialNumber || ""}
                        error={errors.cameraSerialNumber}
                        register={register}
                        required
                        readOnly={isReadOnly}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Lease & Sold ── */}
              {stepNumber === 3 && (
                <div className="pt-4">
                  {/* Lease section */}
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                    {/* Row 1: Is Leased + conditional lease fields */}
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

                        {/* Row 2: spacer + warranty fields */}
                        <div />

                        <TextInput
                          label="Warranty Expiration Date"
                          type="date"
                          name="warrantyExpirationDate"
                          value={watchedValues.warrantyExpirationDate || ""}
                          error={errors.warrantyExpirationDate}
                          register={register}
                          readOnly={isReadOnly}
                        />

                        <TextInput
                          label="Warranty Mileage"
                          type="number"
                          placeholder="0"
                          name="warrantyMileage"
                          value={watchedValues.warrantyMileage || ""}
                          error={errors.warrantyMileage}
                          register={register}
                          readOnly={isReadOnly}
                        />

                        <div />
                      </>
                    ) : (
                      // Empty placeholders so Is Subleased starts on its own row
                      <>
                        <div />
                        <div />
                        <div />
                      </>
                    )}

                    {/* Row 3: Is Subleased + conditional sublease driver */}
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

            {/* Form Actions — same pattern as driverTMS */}
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
                          stepNumber === VEHICLE_FORM_STEPS.length - 1
                            ? "Close"
                            : "Next"
                        }
                        className="btn-dark"
                        onClick={
                          stepNumber === VEHICLE_FORM_STEPS.length - 1
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
                        stepNumber === VEHICLE_FORM_STEPS.length - 1 &&
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

            {/* Status on its own row */}
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

              <CustomSelectRadix
                label="Class ID"
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

              <TextInput
                label="1099 Box"
                type="text"
                placeholder="Select"
                name="vendorBox1099"
                value={leaseVendorForm.box1099}
                onChange={(e) =>
                  setLeaseVendorForm((prev) => ({
                    ...prev,
                    box1099: e.target.value,
                  }))
                }
              />
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

export default VehiclesTMS;
