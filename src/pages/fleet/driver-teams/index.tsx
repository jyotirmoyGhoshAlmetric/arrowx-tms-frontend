import React, { useState, useCallback, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import CustomSelectRadix from "@/components/ui/CustomSelectRadix";
import { toast } from "react-toastify";
import { driverTeamValidationSchema } from "./helper/validationSchema";
import { CARRIER_OPTIONS, DRIVER_OPTIONS } from "./helper/contants";
// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit" | "view";

interface DriverInfo {
  assignedVehicle: string;
  assignedTrailer: string;
  vanType: string;
}

const emptyDriverInfo: DriverInfo = {
  assignedVehicle: "",
  assignedTrailer: "",
  vanType: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

const DriverTeamTMS: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [firstDriverInfo, setFirstDriverInfo] =
    useState<DriverInfo>(emptyDriverInfo);
  const [secondDriverInfo, setSecondDriverInfo] =
    useState<DriverInfo>(emptyDriverInfo);

  const {
    control,
    watch,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<{
    carrier: string;
    firstDriver: string;
    secondDriver: string;
  }>({
    resolver: yupResolver(driverTeamValidationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      carrier: "apple_freight",
      firstDriver: "",
      secondDriver: "",
    },
  });

  const watchedValues = watch();
  const isReadOnly = modalMode === "view";

  // ── React to firstDriver selection ──
  useEffect(() => {
    if (watchedValues.firstDriver) {
      // TODO: replace with actual API call using watchedValues.firstDriver as ID
      setFirstDriverInfo({
        assignedVehicle: "TRK-001",
        assignedTrailer: "TRL-045",
        vanType: "Dry Van",
      });
    } else {
      setFirstDriverInfo(emptyDriverInfo);
    }
  }, [watchedValues.firstDriver]);

  // ── React to secondDriver selection ──
  useEffect(() => {
    if (watchedValues.secondDriver) {
      // TODO: replace with actual API call using watchedValues.secondDriver as ID
      setSecondDriverInfo({
        assignedVehicle: "TRK-002",
        assignedTrailer: "TRL-046",
        vanType: "Reefer",
      });
    } else {
      setSecondDriverInfo(emptyDriverInfo);
    }
  }, [watchedValues.secondDriver]);

  // Whether the two selected drivers have mismatched assignments
  const hasMismatch =
    !!watchedValues.firstDriver &&
    !!watchedValues.secondDriver &&
    (firstDriverInfo.assignedVehicle !== secondDriverInfo.assignedVehicle ||
      firstDriverInfo.assignedTrailer !== secondDriverInfo.assignedTrailer ||
      firstDriverInfo.vanType !== secondDriverInfo.vanType);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setModalMode("add");
    reset();
    clearErrors();
    setFirstDriverInfo(emptyDriverInfo);
    setSecondDriverInfo(emptyDriverInfo);
  }, [reset, clearErrors]);

  const handleAdd = useCallback(() => {
    setModalMode("add");
    reset();
    setShowModal(true);
  }, [reset]);

  const onSubmit = useCallback(
    (data: any) => {
      if (hasMismatch) {
        toast.error(
          "Team Drivers must have same Vehicle, Trailer and Van Type assigned to them.",
        );
        return;
      }
      console.log("Driver team submitted:", data);
      toast.success(
        modalMode === "add"
          ? "Driver team created successfully"
          : "Driver team updated successfully",
      );
      handleModalClose();
    },
    [modalMode, hasMismatch, handleModalClose],
  );

  const modalTitle =
    modalMode === "add"
      ? "Create new driver team"
      : modalMode === "edit"
        ? "Edit Driver Team"
        : "Driver Team Details";

  // ── Reusable driver info display ──
  const DriverInfoDisplay = ({
    info,
  }: {
    info: DriverInfo;
  }) => (
    <>
      <div className="pb-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          Assigned Vehicle:
        </p>
        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium min-h-5">
          {info.assignedVehicle}
        </p>
      </div>
      <div className="pb-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          Assigned Trailer:
        </p>
        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium min-h-5">
          {info.assignedTrailer}
        </p>
      </div>
      <div className="pb-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          Van Type:
        </p>
        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium min-h-5">
          {info.vanType}
        </p>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Driver Teams
        </h2>
        <Button
          text="Add Driver Team"
          className="btn-dark"
          onClick={handleAdd}
          icon="heroicons-outline:plus"
        />
      </div>

      {/* Driver Team Modal */}
      <Modal
        centered
        className="max-w-3xl"
        title={modalTitle}
        activeModal={showModal}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 pt-2">

            {/* Carrier */}
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

            {/* First Driver row */}
            <div className="grid grid-cols-4 gap-4 items-end">
              <CustomSelectRadix
                label="First Driver"
                name="firstDriver"
                options={DRIVER_OPTIONS}
                control={control}
                error={errors.firstDriver}
                placeholder="Select Driver"
                disabled={isReadOnly}
                isSearchable={true}
                required
              />
              <DriverInfoDisplay info={firstDriverInfo} />
            </div>

            {/* Second Driver row */}
            <div className="grid grid-cols-4 gap-4 items-end">
              <CustomSelectRadix
                label="Second Driver"
                name="secondDriver"
                options={DRIVER_OPTIONS}
                control={control}
                error={errors.secondDriver}
                placeholder="Select Driver"
                disabled={isReadOnly}
                isSearchable={true}
                required
              />
              <DriverInfoDisplay info={secondDriverInfo} />
            </div>

            {/* Mismatch warning */}
            {hasMismatch && (
              <p className="text-sm text-red-500 italic">
                *Team Drivers must have same Vehicle, Trailer and Van Type
                assigned to them. Please select new assignment
              </p>
            )}
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

export default DriverTeamTMS;