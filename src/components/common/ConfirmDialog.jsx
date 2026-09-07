import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={!loading}>
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <FiAlertTriangle className="text-2xl" />
        </div>
        <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
