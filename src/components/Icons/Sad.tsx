import { _icon } from "./_icon";

export function SadIcon({ size: _size }: { size?: number | string }) {
  const size = _size || 30;
  return (
    <svg viewBox="0 0 36 36" height={size} width={size}>
      <path fill="#ffcc4d" d="M36 18a18 18 0 11-36 0 18 18 0 0136 0" />
      <path
        fill="#664500"
        d="M17 18c0-1 0-1 0 0H9c0-1 0-1 0 0 0 0-1 0 0 0 0 0 1 4 4 4s4-4 4-4h0zm10 0c0-1 0-1 0 0h-8c0-1 0-1 0 0 0 0-1 0 0 0 0 0 1 4 4 4s4-4 4-4h0zm-5 10h-8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2zM6 14a1 1 0 0 1 0-2s4 0 6-4a1 1 0 0 1 2 2c-3 4-8 4-8 4zm24 0s-5 0-8-4a1 1 0 1 1 2-2c2 4 6 4 6 4a1 1 0 0 1 0 2z"
      />
    </svg>
  );
}
