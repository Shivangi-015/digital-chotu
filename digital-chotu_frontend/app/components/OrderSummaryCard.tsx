export type OrderItem = {
  name: string;
  quantity: string;
  price: number;
};

type OrderSummaryCardProps = {
  items: OrderItem[];
  total: number;
  onConfirm: () => void;
  confirmed?: boolean;
};

export function OrderSummaryCard({
  items,
  total,
  onConfirm,
  confirmed = false,
}: OrderSummaryCardProps) {
  return (
    <div className="max-w-[85%] rounded-[20px] border border-[#E8E4F4] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[17px] font-bold text-[#2D2640]">
        Your order summary
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-start justify-between gap-3 text-[16px] text-[#2D2640]"
          >
            <span>
              {item.name}
              <span className="block text-[14px] text-[#8B7FD9]">
                {item.quantity}
              </span>
            </span>
            <span className="shrink-0 font-semibold">₹{item.price}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-[#EDEBFA] pt-4 text-[17px] font-bold text-[#2D2640]">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
      {!confirmed && (
        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 w-full rounded-[16px] bg-[#FFB88C] px-6 py-4 text-[17px] font-bold text-[#2D2640] transition-opacity hover:opacity-90"
        >
          Yes, place my order
        </button>
      )}
      {confirmed && (
        <p className="mt-5 rounded-[16px] bg-[#EDEBFA] px-4 py-3 text-center text-[16px] font-semibold text-[#8B7FD9]">
          Order confirmed
        </p>
      )}
    </div>
  );
}
