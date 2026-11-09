export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-4 h-2 w-2 shrink-0 rounded-full bg-[#8B7FD9]"
        aria-hidden="true"
      />
      <div
        className="flex items-center gap-1.5 rounded-[20px] bg-[#EDEBFA] px-5 py-4"
        aria-label="Chotu is typing"
      >
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7FD9] [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7FD9] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7FD9] [animation-delay:300ms]" />
      </div>
    </div>
  );
}
