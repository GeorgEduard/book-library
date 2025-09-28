import React from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  shouldCloseOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onRequestClose,
  title,
  children,
  footer,
  shouldCloseOnOverlayClick = true,
}: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      className="max-w-lg w-[90vw] mx-auto mt-24 outline-none"
      overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl ring-1 ring-emerald-100 overflow-hidden">
        {title ? (
          <div className="px-4 py-3 border-b border-emerald-100">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        ) : null}
        <div className="px-4 py-4">{children}</div>
        {footer ? (
          <div className="px-4 py-3 bg-emerald-50/60 border-t border-emerald-100 flex justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </div>
    </ReactModal>
  );
}
