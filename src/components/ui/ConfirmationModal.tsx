import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { type AvailableIcon, isIconAvailable } from "@/config/icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
  icon?: string;
  iconClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "btn-dark",
  isLoading = false,
  icon,
  iconClass = "text-slate-400",
}) => {
  return (
    <Modal
      centered
      className="max-w-md"
      title={title}
      activeModal={isOpen}
      onClose={onClose}
    >
      <div className="content-box">
        <div className="text-center">
          {icon && (
            <div className="mx-auto flex items-center justify-center w-12 h-12 mb-4">
              <Icon
                icon={
                  (icon && isIconAvailable(icon)
                    ? icon
                    : "heroicons:exclamation-triangle") as AvailableIcon
                }
                className={`w-8 h-8 ${iconClass}`}
              />
            </div>
          )}

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {description}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            text={cancelText}
            className="btn-outline-dark"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          />
          <Button
            text={confirmText}
            className={confirmButtonClass}
            onClick={onConfirm}
            type="button"
            isLoading={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};
