// A brick staircase between sections, with a floor running on from its
// foot. Every step is a ledge in the game (data-solid), so the character
// can walk down the page and jump back up; alternating the direction
// makes the way down zig-zag. Out of the game it's a small piece of
// scenery, hidden from assistive technology.
export default function Stairs({ steps = 6, reverse = false }: { steps?: number; reverse?: boolean }) {
  return (
    <div aria-hidden className={`flex items-end ${reverse ? "flex-row-reverse" : ""}`}>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          data-solid
          className="stair block w-8 shrink-0 sm:w-11"
          style={{ height: `calc(${steps - i} * 6 * var(--px))` }}
        />
      ))}
      <span data-solid className="block h-[var(--px)] flex-1 bg-line" />
    </div>
  );
}
