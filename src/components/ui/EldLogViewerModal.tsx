import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface EldLogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  startTime?: string;
  endTime?: string;
  formatDate?: (date: string) => string;
}

const EldLogViewerModal: React.FC<EldLogViewerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  startTime,
  endTime,
  formatDate,
}) => {
  const displayStartTime =
    formatDate && startTime ? formatDate(startTime) : startTime;
  const displayEndTime = formatDate && endTime ? formatDate(endTime) : endTime;

  return (
    <Modal
      centered
      title="Navigate to ELD Log Viewer"
      activeModal={isOpen}
      onClose={onClose}
      className="max-w-2xl"
    >
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        You are about to navigate to the ELD Log Viewer for the time period from{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          {displayStartTime}
        </strong>{" "}
        to{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          {displayEndTime}
        </strong>
        . Do you want to continue?
      </p>
      <div className="flex justify-between space-x-3">
        <Button onClick={onClose} className="btn-outline-dark">
          Cancel
        </Button>

        <Button onClick={onConfirm} className="btn-dark">
          Navigate
        </Button>
      </div>
    </Modal>
  );
};

export default EldLogViewerModal;
