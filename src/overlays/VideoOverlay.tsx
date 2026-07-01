import { AbsoluteFill } from "remotion";
import { LowerThird, type LowerThirdProps } from "./LowerThird";
import { SubtitleOverlay, type SubtitleOverlayProps } from "./SubtitleOverlay";

export type VideoOverlayProps = {
  subtitles?: SubtitleOverlayProps;
  lowerThirds?: LowerThirdProps[];
  /** Transparent background — set true when used as overlay on real footage */
  transparent?: boolean;
};

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  subtitles,
  lowerThirds = [],
  transparent = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: transparent ? "transparent" : undefined,
        pointerEvents: "none",
      }}
    >
      {subtitles && <SubtitleOverlay {...subtitles} />}
      {lowerThirds.map((lt, i) => (
        <LowerThird key={i} {...lt} />
      ))}
    </AbsoluteFill>
  );
};
