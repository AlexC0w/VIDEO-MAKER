import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type SubtitleWord = {
  word: string;
  start: number;
  end: number;
};

export type SubtitleOverlayProps = {
  words: SubtitleWord[];
  /** chunk size — how many words show at once */
  chunkSize?: number;
  fontSize?: number;
  color?: string;
  background?: string;
  position?: "bottom" | "top" | "middle";
  uppercase?: boolean;
};

function getActiveChunk(
  words: SubtitleWord[],
  chunkSize: number,
  currentSec: number,
): SubtitleWord[] | null {
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize);
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    if (currentSec >= first.start && currentSec <= last.end + 0.1) {
      return chunk;
    }
  }
  return null;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  words,
  chunkSize = 2,
  fontSize = 80,
  color = "#ffffff",
  background = "rgba(0,0,0,0.55)",
  position = "bottom",
  uppercase = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;

  const chunk = getActiveChunk(words, chunkSize, currentSec);
  if (!chunk) return null;

  const text = chunk.map((w) => w.word).join(" ");
  const displayed = uppercase ? text.toUpperCase() : text;

  const chunkStart = chunk[0].start;
  const chunkEnd = chunk[chunk.length - 1].end;
  const durationFrames = Math.max(1, (chunkEnd - chunkStart) * fps);
  const localFrame = frame - chunkStart * fps;

  const opacity = interpolate(localFrame, [0, 4, durationFrames - 4, durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(localFrame, [0, 6], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const verticalAlign =
    position === "bottom"
      ? { bottom: 120 }
      : position === "top"
        ? { top: 120 }
        : { top: "50%" };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          left: 0,
          opacity,
          position: "absolute",
          right: 0,
          transform: `translateY(${translateY}px)`,
          ...verticalAlign,
        }}
      >
        <div
          style={{
            background,
            borderRadius: 12,
            color,
            fontFamily: "Barlow Condensed, Impact, Arial Narrow, sans-serif",
            fontSize,
            fontWeight: 900,
            letterSpacing: "0.04em",
            padding: "12px 28px",
            textAlign: "center",
            textTransform: uppercase ? "uppercase" : "none",
          }}
        >
          {displayed}
        </div>
      </div>
    </AbsoluteFill>
  );
};
