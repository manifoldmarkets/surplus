import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Surplus — a software incubator for massive public good in the age of transformative AI.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const paper = "#f1e8d2";
const inkBlue = "#1f2f7a";
const inkPink = "#ff3d7f";
const inkYellow = "#f7c72e";
const inkDark = "#14152b";

// The hero's supply-demand graph, minus its <text> labels — satori can't
// load fonts inside an embedded SVG, so labels are overlaid as HTML below.
const graphSvg = `<svg viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="db" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.1" fill="${inkBlue}"/></pattern>
    <pattern id="dp" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.4" fill="${inkPink}"/></pattern>
  </defs>
  <g opacity="0.8">
    <path d="M100,100 L330,280 L100,280 Z" fill="url(#db)"/>
    <path d="M100,460 L330,280 L100,280 Z" fill="url(#dp)"/>
  </g>
  <g stroke="${inkDark}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8">
    <line x1="80" y1="280" x2="330" y2="280" stroke-dasharray="1 9"/>
    <line x1="330" y1="280" x2="330" y2="480" stroke-dasharray="1 9"/>
  </g>
  <g stroke-linecap="round" fill="none">
    <line x1="100" y1="100" x2="560" y2="460" stroke="${inkBlue}" stroke-width="7"/>
    <line x1="100" y1="460" x2="560" y2="100" stroke="${inkPink}" stroke-width="7"/>
  </g>
  <line x1="80" y1="480" x2="80" y2="55" stroke="${inkDark}" stroke-width="4"/>
  <line x1="80" y1="480" x2="585" y2="480" stroke="${inkDark}" stroke-width="4"/>
  <path d="M80,43 L73,57 L87,57 Z" fill="${inkDark}"/>
  <path d="M597,480 L583,473 L583,487 Z" fill="${inkDark}"/>
</svg>`;
const graphSrc = `data:image/svg+xml,${encodeURIComponent(graphSvg)}`;

// Graph is drawn at 0.5× its 640×560 viewBox
const GRAPH_W = 320;
const GRAPH_H = 280;

export default async function Image() {
  const [bowlby, antonio, inconsolata, newsreader] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BowlbyOne-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Antonio-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Inconsolata-Medium.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Newsreader-MediumItalic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: paper,
          padding: "44px 56px 40px",
          fontFamily: "Inconsolata",
          color: inkDark,
        }}
      >
        {/* kicker chips */}
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              display: "flex",
              backgroundColor: inkDark,
              color: paper,
              padding: "7px 14px",
              fontSize: 19,
              letterSpacing: 3,
            }}
          >
            A SOFTWARE INCUBATOR
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: inkPink,
              color: paper,
              padding: "7px 14px",
              fontSize: 19,
              letterSpacing: 3,
            }}
          >
            FOR MASSIVE PUBLIC GOOD
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: inkDark,
              color: inkYellow,
              padding: "7px 14px",
              fontSize: 19,
              letterSpacing: 3,
            }}
          >
            IN THE AGE OF TRANSFORMATIVE AI
          </div>
        </div>

        {/* wordmark */}
        <div
          style={{
            display: "flex",
            fontFamily: "Bowlby One",
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: -8,
            marginTop: 8,
            marginBottom: 2,
          }}
        >
          <span style={{ color: inkDark }}>SUR</span>
          <span style={{ color: inkPink }}>PLUS</span>
        </div>

        {/* rule + dateline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `4px solid ${inkDark}`,
            paddingTop: 12,
            fontSize: 20,
            letterSpacing: 3,
          }}
        >
          <span>» ORGANIZED BY MANIFUND &amp; MOX</span>
          <span>3 MONTHS · STARTING EARLY AUGUST</span>
          <span>SAN FRANCISCO</span>
        </div>

        {/* bottom row: quote + CTA left, graph right */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 600,
              paddingBottom: 26,
            }}
          >
            <div
              style={{
                fontFamily: "Newsreader",
                fontSize: 33,
                lineHeight: 1.25,
                color: inkDark,
              }}
            >
              “Surplus” is the value created through positive-sum trades; what
              markets produce in abundance.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                backgroundColor: inkPink,
                color: paper,
                padding: "12px 20px",
                fontSize: 22,
                letterSpacing: 3,
                boxShadow: `7px 7px 0 ${inkBlue}`,
              }}
            >
              APPLY BY JULY 10 » SURPLUS.DEV
            </div>
          </div>

          {/* graph + label overlays; positions are svg coords × 0.62 */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: GRAPH_W,
              height: GRAPH_H,
            }}
          >
            <img src={graphSrc} width={GRAPH_W} height={GRAPH_H} alt="" />
            <div
              style={{
                position: "absolute",
                left: 190,
                top: 56,
                transform: "rotate(-38deg)",
                fontFamily: "Antonio",
                fontSize: 18,
                letterSpacing: 2,
                color: inkPink,
              }}
            >
              SUPPLY
            </div>
            <div
              style={{
                position: "absolute",
                left: 171,
                top: 183,
                transform: "rotate(38deg)",
                fontFamily: "Antonio",
                fontSize: 18,
                letterSpacing: 2,
                color: inkBlue,
              }}
            >
              DEMAND
            </div>
            <div
              style={{
                position: "absolute",
                left: -4,
                top: 42,
                transform: "rotate(-90deg)",
                fontFamily: "Antonio",
                fontSize: 15,
                letterSpacing: 3,
                color: inkDark,
              }}
            >
              PRICE
            </div>
            <div
              style={{
                position: "absolute",
                right: 28,
                top: 246,
                fontFamily: "Antonio",
                fontSize: 15,
                letterSpacing: 3,
                color: inkDark,
              }}
            >
              QUANTITY
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bowlby One", data: bowlby, style: "normal", weight: 400 },
        { name: "Antonio", data: antonio, style: "normal", weight: 700 },
        { name: "Inconsolata", data: inconsolata, style: "normal", weight: 500 },
        { name: "Newsreader", data: newsreader, style: "italic", weight: 500 },
      ],
    }
  );
}
