type ChotuBubbleProps = {
  children: React.ReactNode;
};

export function ChotuBubble({ children }: ChotuBubbleProps) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-4 h-2 w-2 shrink-0 rounded-full bg-[#8B7FD9]"
        aria-hidden="true"
      />
      <div className="max-w-[85%] rounded-[20px] bg-[#EDEBFA] px-5 py-4 text-[17px] leading-relaxed text-[#2D2640]">
        {children}
      </div>
    </div>
  );
}
