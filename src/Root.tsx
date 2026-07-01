import "./index.css";
import { Composition } from "remotion";
import { MyComposition, videoDurationInFrames } from "./Composition";
import { VideoOverlay, type VideoOverlayProps } from "./overlays/VideoOverlay";

const overlayDefaultProps: VideoOverlayProps = {
  transparent: true,
  lowerThirds: [
    { title: "Ejemplo Lower Third", subtitle: "Subtítulo aquí", startAt: 1, duration: 4 },
  ],
  subtitles: {
    words: [
      { word: "Hola", start: 0, end: 0.5 },
      { word: "mundo", start: 0.5, end: 1.0 },
    ],
    chunkSize: 2,
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Vesto brand video ─────────────────────────────── */}
      <Composition
        id="OctaneVertical"
        component={MyComposition}
        durationInFrames={videoDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" }}
      />
      <Composition
        id="OctaneHorizontal"
        component={MyComposition}
        durationInFrames={videoDurationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ format: "horizontal" }}
      />

      {/* ── Generic overlay compositions for video-use ────── */}
      {/*
          These render with a transparent background so ffmpeg can
          composite them over real footage:
            remotion render OverlayVertical --props='{"subtitles":{...}}'
            then: ffmpeg -i footage.mp4 -i overlay.webm -filter_complex overlay ...
      */}
      <Composition
        id="OverlayVertical"
        component={VideoOverlay}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={overlayDefaultProps}
      />
      <Composition
        id="OverlayHorizontal"
        component={VideoOverlay}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={overlayDefaultProps}
      />
    </>
  );
};
