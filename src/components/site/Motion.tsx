/** The switch that turns the page's motion on and off. It's a plain
 *  checkbox, and globals.css stops every animation while it's unchecked,
 *  so it works without JavaScript. MotionScript, right after it, adds two
 *  things when scripts run: the switch starts off for anyone whose system
 *  asks for reduced motion, and it remembers the visitor's choice in
 *  localStorage. Without scripts, the system setting stops the motion
 *  instead (the data-js rule in globals.css). */
export function MotionToggle() {
  return (
    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-foreground">
      <input id="motion" type="checkbox" role="switch" defaultChecked className="peer sr-only" />
      <span aria-hidden className="switch" />
      Motion
    </label>
  );
}

// Runs as soon as the parser reaches it, before the first paint, so the
// motion never starts and then stops. It only reads and sets the
// checkbox, an attribute and localStorage: no Trusted Types sinks.
const script = `(function () {
  var t = document.getElementById("motion");
  if (!t) return;
  document.documentElement.setAttribute("data-js", "");
  var saved = null;
  try { saved = localStorage.getItem("motion"); } catch (e) {}
  t.checked = saved ? saved === "on" : !matchMedia("(prefers-reduced-motion: reduce)").matches;
  t.addEventListener("change", function () {
    try { localStorage.setItem("motion", t.checked ? "on" : "off"); } catch (e) {}
  });
})();`;

export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
