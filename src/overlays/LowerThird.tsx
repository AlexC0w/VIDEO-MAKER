import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type LowerThirdProps = {
  title: string;
  subtitle?: string;
  accentColor?: string;
  textColor?: string;
  background?: string;
  /** seconds from start when this lower third should appear */
  startAt?: number;
  /** how long to show it (seconds) */
  duration?: number;
};

export const LowerThird: React.FC<LowerThirdProps> = ({
  title,
  subtitle,
  accentColor = "#A4100D",
  textColor = "#ffffff",
  background = "rgba(0,0,0,0.82)",
  startAt = 0,
  duration = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = startAt * fps;
  const endFrame = startFrame + duration * fps;
  const localFrame = frame - startFrame;
  const outFrame = frame - (endFrame - 12);

  if (frame < startFrame || frame > endFrame) return null;

  const slideIn = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: { damping: 20, stiffness: 180, mass: 0.7 },
  });

  const slideOut = frame > endFrame - 12
    ? spring({ frame: Math.max(0, outFrame), fps, config: { damping: 18, stiffness: 160, mass: 0.7 } })
    : 0;

  const x = interpolate(slideIn, [0, 1], [-420, 0]) + interpolate(slideOut, [0, 1], [0, -420]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          bottom: 180,
          left: 0,
          position: "absolute",
          transform: `translateX(${x}px)`,
        }}
      >
        <div
          style={{
            alignItems: "stretch",
            background,
            borderRadius: "0 8px 8px 0",
            display: "flex",
            gap: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ background: accentColor, width: 8 }} />
          <div style={{ padding: "16px 28px" }}>
            <div
              style={{
                color: textColor,
                fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontFamily: "Readex Pro, Segoe UI, Arial, sans-serif",
                  fontSize: 24,
                  marginTop: 4,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
