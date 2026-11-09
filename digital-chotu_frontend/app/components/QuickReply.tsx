type QuickReplyProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function QuickReply({ label, onClick, disabled }: QuickReplyProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-[#8B7FD9] bg-white px-5 py-2.5 text-[16px] font-semibold text-[#8B7FD9] transition-colors hover:bg-[#EDEBFA] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
