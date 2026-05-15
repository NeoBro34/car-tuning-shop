"use client";

type QuantitySelectorProps = {
  max: number;
  value: number;
  onChange: (quantity: number) => void;
};

export function QuantitySelector({
  max,
  value,
  onChange,
}: QuantitySelectorProps) {
  const isDisabled = max <= 0;
  const safeValue = isDisabled ? 0 : value;

  function setQuantity(nextValue: number) {
    if (isDisabled) {
      onChange(0);
      return;
    }

    onChange(Math.min(Math.max(nextValue, 1), max));
  }

  return (
    <div>
      <label className="text-sm font-bold text-zinc-300" htmlFor="quantity">
        Quantity
      </label>
      <div className="mt-2 grid h-11 w-36 grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded-md border border-white/10 bg-black/25">
        <button
          aria-label="Decrease quantity"
          className="border-r border-white/10 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isDisabled || safeValue <= 1}
          onClick={() => setQuantity(safeValue - 1)}
          type="button"
        >
          -
        </button>
        <input
          className="w-full bg-transparent text-center text-sm font-bold text-white outline-none disabled:bg-zinc-900"
          disabled={isDisabled}
          id="quantity"
          max={max}
          min={isDisabled ? 0 : 1}
          onChange={(event) => setQuantity(Number(event.target.value))}
          type="number"
          value={safeValue}
        />
        <button
          aria-label="Increase quantity"
          className="border-l border-white/10 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isDisabled || safeValue >= max}
          onClick={() => setQuantity(safeValue + 1)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
