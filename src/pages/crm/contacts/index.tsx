import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import InputGroup from "@/components/ui/InputGroup";
import { toast } from "react-toastify";

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_COUNTRY_CODES = [
  { value: "US", label: "🇺🇸 (+1)" },
  { value: "MX", label: "🇲🇽 (+52)" },
  { value: "CA", label: "🇨🇦 (+1)" },
];

const CUSTOMER_OPTIONS = [
  { value: "customer1", label: "Customer 1" },
  { value: "broker1", label: "Broker 1" },
  // TODO: populate from API
];

const CONTACT_TYPE_OPTIONS = [
  { value: "general", label: "General" },
  { value: "billing", label: "Billing" },
  { value: "dispatch", label: "Dispatch" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  // TODO: populate from API
];

// ─── Validation Schema ────────────────────────────────────────────────────────

const contactValidationSchema = Yup.object().shape({
  customer: Yup.string().required("Customer is required"),
  contactPerson: Yup.string().required("Contact person is required"),
  email: Yup.string().nullable(),
  fax: Yup.string().nullable(),
  phone1: Yup.string().nullable(),
  phone1Ext: Yup.string().nullable(),
  phone2: Yup.string().nullable(),
  phone2Ext: Yup.string().nullable(),
  phone3: Yup.string().nullable(),
  phone3Ext: Yup.string().nullable(),
  phone4: Yup.string().nullable(),
  phone4Ext: Yup.string().nullable(),
  phone5: Yup.string().nullable(),
  phone5Ext: Yup.string().nullable(),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  zipCode: Yup.string().nullable(),
  notes: Yup.string().nullable(),
  contactType: Yup.string().required("Contact type is required"),
  status: Yup.boolean(),
  preferred: Yup.boolean(),
  sendTruckCapacity: Yup.boolean(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit" | "view";

// ─── Component ────────────────────────────────────────────────────────────────

const ContactTMS: React.FC = () => {
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
    resolver: yupResolver(contactValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      customer: "",
      contactPerson: "",
      email: "",
      fax: "",
      phone1: "",
      phone1CountryCode: "US",
      phone1Ext: "",
      phone2: "",
      phone2CountryCode: "US",
      phone2Ext: "",
      phone3: "",
      phone3CountryCode: "US",
      phone3Ext: "",
      phone4: "",
      phone4CountryCode: "US",
      phone4Ext: "",
      phone5: "",
      phone5CountryCode: "US",
      phone5Ext: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
      contactType: "general",
      status: true,
      preferred: true,
      sendTruckCapacity: false,
    },
  });

  const watchedValues = watch();
  const isReadOnly = modalMode === "view";

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setModalMode("add");
    reset();
    clearErrors();
  }, [reset, clearErrors]);

  const handleAdd = useCallback(() => {
    setModalMode("add");
    reset();
    setShowModal(true);
  }, [reset]);

  const onSubmit = useCallback(
    (data: any) => {
      console.log("Contact submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Contact created successfully"
          : "Contact updated successfully",
      );
      handleModalClose();
    },
    [modalMode, handleModalClose],
  );

  const modalTitle =
    modalMode === "add"
      ? "Create new contact"
      : modalMode === "edit"
        ? "Edit Contact"
        : "Contact Details";

  // ─── Phone + Ext Row ─────────────────────────────────────────────────────────
  // InputGroup with left country-code select (same pattern as Cell Phone in Drivers)
  // Ext uses TextInput
  const PhoneRow = ({
    label,
    phoneName,
    countryCodeName,
    extName,
  }: {
    label: string;
    phoneName: string;
    countryCodeName: string;
    extName: string;
  }) => (
    <div className="flex items-end gap-3">
      {/* Phone + country code via InputGroup */}
      <div className="flex-1">
        <InputGroup
          label={label}
          name={phoneName}
          inputPlaceholder="Enter phone number"
          inputValue={watchedValues[phoneName] || ""}
          leftElement="select"
          leftSelectOptions={CELL_COUNTRY_CODES}
          leftSelectValue={watchedValues[countryCodeName] || "US"}
          leftSelectName={countryCodeName}
          leftSelectSearchable={true}
          leftElementWidth="100px"
          size="md"
          control={control}
          error={errors[phoneName] || errors[countryCodeName]}
          onInputChange={(e) => {
            const cleanedValue = e.target.value.replace(/[^0-9]/g, "");
            setValue(phoneName, cleanedValue, { shouldDirty: true });
            if (cleanedValue) {
              setTimeout(() => trigger(phoneName), 100);
            }
          }}
          onLeftSelectChange={(value) => {
            setValue(countryCodeName, String(value), { shouldDirty: true });
          }}
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>

      {/* Ext as TextInput */}
      <div className="w-24 shrink-0">
        <TextInput
          label="Ext:"
          type="text"
          placeholder=""
          name={extName}
          value={watchedValues[extName] || ""}
          error={errors[extName]}
          register={register}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Contacts
        </h2>
        <Button
          text="Add Contact"
          className="btn-dark"
          onClick={handleAdd}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Contact Modal */}
      <Modal
        centered
        className="max-w-3xl"
        title={modalTitle}
        activeModal={showModal}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* No overflow/scroll — all content visible at once */}
          <div className="px-1 pt-2">

            {/* Row 1: Customer | Contact person */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <CustomSelectRadix
                label="Customer"
                name="customer"
                options={CUSTOMER_OPTIONS}
                control={control}
                error={errors.customer}
                placeholder="Select Customer/Broker"
                disabled={isReadOnly}
                isSearchable={true}
                required
              />
              <TextInput
                label="Contact person"
                type="text"
                placeholder=""
                name="contactPerson"
                value={watchedValues.contactPerson || ""}
                error={errors.contactPerson}
                register={register}
                required
                readOnly={isReadOnly}
              />
            </div>

            {/* Row 2: Email | Fax */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <TextInput
                label="Email"
                type="email"
                placeholder=""
                name="email"
                value={watchedValues.email || ""}
                error={errors.email}
                register={register}
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
            </div>

            {/* Two-column: Phones (left) | Address fields (right) */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              {/* Left — Phone 1 to Phone 5 using InputGroup + Ext spinner */}
              <div className="space-y-4">
                <PhoneRow label="Phone 1" phoneName="phone1" countryCodeName="phone1CountryCode" extName="phone1Ext" />
                <PhoneRow label="Phone 2" phoneName="phone2" countryCodeName="phone2CountryCode" extName="phone2Ext" />
                <PhoneRow label="Phone 3" phoneName="phone3" countryCodeName="phone3CountryCode" extName="phone3Ext" />
                <PhoneRow label="Phone 4" phoneName="phone4" countryCodeName="phone4CountryCode" extName="phone4Ext" />
                <PhoneRow label="Phone 5" phoneName="phone5" countryCodeName="phone5CountryCode" extName="phone5Ext" />
              </div>

              {/* Right — Address, City, State, Zip code, Notes */}
              <div className="space-y-4">
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
                  label="City"
                  type="text"
                  placeholder="Please enter 1 or more characters"
                  name="city"
                  value={watchedValues.city || ""}
                  error={errors.city}
                  register={register}
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
                  readOnly={isReadOnly}
                />
                <TextInput
                  label="Zip code"
                  type="text"
                  placeholder=""
                  name="zipCode"
                  value={watchedValues.zipCode || ""}
                  error={errors.zipCode}
                  register={register}
                  readOnly={isReadOnly}
                />
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
              </div>
            </div>

            {/* Bottom row: Contact Type | Toggles */}
            <div className="grid grid-cols-2 gap-5">
              {/* Contact Type — CustomSelectRadix */}
              <CustomSelectRadix
                label="Contact Type"
                name="contactType"
                options={CONTACT_TYPE_OPTIONS}
                control={control}
                error={errors.contactType}
                placeholder="Select Contact Type"
                disabled={isReadOnly}
                isSearchable={false}
                required
              />

              {/* Status | Preferred | Send Truck Capacity toggles */}
              <div className="flex items-end gap-6 pb-1">
                <Switch
                  name="status"
                  label="Status"
                  value={watchedValues.status ?? true}
                  onChange={(e) =>
                    setValue("status", e.target.checked, { shouldDirty: true })
                  }
                  disabled={isReadOnly}
                />
                <Switch
                  name="preferred"
                  label="Preferred"
                  value={watchedValues.preferred ?? true}
                  onChange={(e) =>
                    setValue("preferred", e.target.checked, { shouldDirty: true })
                  }
                  disabled={isReadOnly}
                />
                <Switch
                  name="sendTruckCapacity"
                  label="Send Truck Capacity"
                  value={watchedValues.sendTruckCapacity || false}
                  onChange={(e) =>
                    setValue("sendTruckCapacity", e.target.checked, { shouldDirty: true })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              text="Cancel"
              className="btn-outline-dark"
              type="button"
              onClick={handleModalClose}
            />
            {modalMode !== "view" && (
              <Button
                text="Save"
                className="btn-primary"
                type="submit"
                icon="heroicons-outline:check"
                disabled={modalMode === "edit" && !isDirty}
              />
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactTMS;