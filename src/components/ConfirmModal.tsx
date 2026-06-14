type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="sheet confirm-sheet">
        <h2>{title}</h2>
        <p className="sheet-copy">{message}</p>
        <div className="actions">
          <button onClick={onConfirm}>{confirmLabel}</button>
          <button className="ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
