import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmDisabled?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm text-black">{message}</p>
    </Modal>
  );
}
