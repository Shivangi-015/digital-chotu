type UserBubbleProps = {
  children: React.ReactNode;
};

export function UserBubble({ children }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-[20px] border border-[#E8E4F4] bg-white px-5 py-4 text-[17px] leading-relaxed text-[#2D2640]">
        {children}
      </div>
    </div>
  );
}
