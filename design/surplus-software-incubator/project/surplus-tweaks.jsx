/* Surplus — Tweaks panel
   Exposes: palette, halftone density, paper grain, misregistration. */

const { useEffect } = React;

const PALETTES = {
  "pink-blue":  ["#FF3D7F", "#1F2F7A", "#F7C72E"],
  "red-blue":   ["#DE2A2A", "#1F2F7A", "#F7C72E"],
  "green-pink": ["#FF3D7F", "#16633C", "#F7C72E"],
  "mono":       ["#14152B", "#9A9277", "#F1E8D2"],
};

function applyTweaks(t) {
  document.body.dataset.palette = t.palette;
  document.body.classList.toggle("grain", !!t.grain);
  document.documentElement.style.setProperty("--halftone-opacity", String(t.halftone));
  document.documentElement.style.setProperty("--misreg", `${t.misregister}px`);
}

function PaletteSwatches({ palette }) {
  const colors = PALETTES[palette] || PALETTES["pink-blue"];
  return (
    <div style={{ display: "flex", gap: 6, padding: "6px 12px 10px" }}>
      {colors.map((c, i) => (
        <span key={i} style={{
          flex: 1, height: 22, background: c,
          border: "1px solid rgba(0,0,0,0.2)", borderRadius: 3,
        }} />
      ))}
    </div>
  );
}

function SurplusTweaks() {
  const [t, setTweak] = useTweaks(window.__TWEAKS__ || {
    palette: "pink-blue",
    halftone: 0.65,
    grain: true,
    misregister: 2,
  });

  useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette">
        <TweakSelect
          label="Inks"
          value={t.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "pink-blue",  label: "Pink × Blue × Yellow" },
            { value: "red-blue",   label: "Red × Blue × Yellow" },
            { value: "green-pink", label: "Green × Pink × Yellow" },
            { value: "mono",       label: "Single-ink black" },
          ]}
        />
        <PaletteSwatches palette={t.palette} />
      </TweakSection>

      <TweakSection label="Print finish">
        <TweakSlider
          label="Halftone"
          value={Math.round(t.halftone * 100)}
          onChange={(v) => setTweak("halftone", v / 100)}
          min={15} max={100} step={5}
          unit="%"
        />
        <TweakSlider
          label="Misregister"
          value={t.misregister}
          onChange={(v) => setTweak("misregister", v)}
          min={0} max={6} step={1}
          unit="px"
        />
        <TweakToggle
          label="Paper grain"
          value={t.grain}
          onChange={(v) => setTweak("grain", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// apply once on load (in case Tweaks panel is never opened)
applyTweaks(window.__TWEAKS__);

const _root = document.createElement("div");
document.body.appendChild(_root);
ReactDOM.createRoot(_root).render(<SurplusTweaks />);
