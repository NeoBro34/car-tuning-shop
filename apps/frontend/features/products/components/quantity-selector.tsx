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
      <label
        className="text-sm font-semibold text-zinc-700"
        htmlFor="quantity"
      >
        Quantity
      </label>
      <div className="mt-2 grid h-11 w-36 grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded-md border border-zinc-300 bg-white">
        <button
          aria-label="Decrease quantity"
          className="border-r border-zinc-300 font-bold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isDisabled || safeValue <= 1}
          onClick={() => setQuantity(safeValue - 1)}
          type="button"
        >
          -
        </button>
        <input
          className="w-full text-center text-sm font-bold outline-none disabled:bg-zinc-100"
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
          className="border-l border-zinc-300 font-bold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
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
