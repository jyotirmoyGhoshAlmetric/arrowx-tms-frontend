import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import { toast } from "react-toastify";
import { fuelCardValidationSchema } from "./helper/validationSchema";
import { CARRIER_OPTIONS, DRIVER_OPTIONS, FUEL_CARD_TYPE_OPTIONS } from "./helper/constants";


// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit" | "view";

// ─── Component ────────────────────────────────────────────────────────────────

const FuelCardTMS: React.FC = () => {
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
  } = useForm<{
    carrier: string;
    driver: string;
    fuelCardType: string;
    cardNumber: string;
    isDeductible: boolean;
  }>({
    resolver: yupResolver(fuelCardValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      carrier: "",
      driver: "",
      fuelCardType: "",
      cardNumber: "",
      isDeductible: false,
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
      console.log("Fuel card submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Fuel card added successfully"
          : "Fuel card updated successfully",
      );
      handleModalClose();
    },
    [modalMode, handleModalClose],
  );

  const modalTitle =
    modalMode === "add"
      ? "Add new Fuel Card Info"
      : modalMode === "edit"
        ? "Edit Fuel Card Info"
        : "Fuel Card Info";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Fuel Cards
        </h2>
        <Button
          text="Add Fuel Card"
          className="btn-dark"
          onClick={handleAdd}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Fuel Card Modal */}
      <Modal
        centered
        className="max-w-3xl"
        title={modalTitle}
        activeModal={showModal}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 pt-2">

            {/* Row 1: Carrier | Driver | Fuel Card Type | Card # */}
            <div className="grid grid-cols-4 gap-5">
              <CustomSelectRadix
                label="Carrier"
                name="carrier"
                options={CARRIER_OPTIONS}
                control={control}
                error={errors.carrier}
                placeholder="Select Carrier"
                disabled={isReadOnly}
                isSearchable={true}
              />

              <CustomSelectRadix
                label="Driver"
                name="driver"
                options={DRIVER_OPTIONS}
                control={control}
                error={errors.driver}
                placeholder="Select driver"
                disabled={isReadOnly}
                isSearchable={true}
              />

              <CustomSelectRadix
                label="Fuel Card Type"
                name="fuelCardType"
                options={FUEL_CARD_TYPE_OPTIONS}
                control={control}
                error={errors.fuelCardType}
                placeholder="--Select Fuel Card Type"
                disabled={isReadOnly}
                isSearchable={false}
              />

              <TextInput
                label="Card #"
                type="text"
                placeholder="Enter card number"
                name="cardNumber"
                value={watchedValues.cardNumber || ""}
                error={errors.cardNumber}
                register={register}
                readOnly={isReadOnly}
              />
            </div>

            {/* Row 2: Is Deductible toggle */}
            <div>
              <Switch
                name="isDeductible"
                label="Is Deductible"
                value={watchedValues.isDeductible || false}
                onChange={(e) =>
                  setValue("isDeductible", e.target.checked, {
                    shouldDirty: true,
                  })
                }
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              text="Cancel"
              className="btn-outline-dark"
              type="button"
              onClick={handleModalClose}
            />
            {modalMode !== "view" && (
              <Button
                text="Save"
                className="btn-dark"
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

export default FuelCardTMS;