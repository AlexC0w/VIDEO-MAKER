# VIDEO-MAKER — Claude Guide

This project has two video production engines that work together:

1. **Remotion** — programmatic animated videos (brand, motion graphics, overlays)
2. **video-use** — AI-powered raw footage editor (silence removal, subtitles, color grading)

---

## Project Structure

```
src/
  Composition.tsx        — Vesto brand video composition (16 scenes)
  Root.tsx               — Registers all compositions
  data/
    vesto-scenes.ts      — Scene data, brand colors, client list (edit this to change content)
  overlays/
    SubtitleOverlay.tsx  — Animated subtitle layer (word-level timestamps → chunks)
    LowerThird.tsx       — Animated lower third with slide-in/out
    VideoOverlay.tsx     — Composite overlay composition (subtitles + lower thirds)
scripts/
  render-overlay.js      — CLI bridge: video-use calls this to render Remotion overlays
public/brand/            — Brand assets (logos, product images)
out/                     — Rendered video output
```

---

## Remotion: Creating Videos

### Run the studio (live preview)
```bash
npm run dev
```

### Render brand videos
```bash
npm run render:vertical     # 1080x1920 vertical (Reels/TikTok)
npm run render:horizontal   # 1920x1080 horizontal (YouTube/ads)
```

### Render overlay (transparent, for compositing on footage)
```bash
npm run render:overlay:h    # horizontal overlay → out/overlay-horizontal.webm
npm run render:overlay:v    # vertical overlay → out/overlay-vertical.webm
```

### Pass custom props to overlay
```bash
npx remotion render OverlayHorizontal out/custom-overlay.webm --props='{"subtitles":{"words":[{"word":"Hola","start":0,"end":0.5},{"word":"mundo","start":0.5,"end":1.0}],"chunkSize":2},"lowerThirds":[{"title":"Nombre aquí","subtitle":"Rol o empresa","startAt":2,"duration":4}]}'
```

### Available Compositions
| ID | Size | Purpose |
|----|------|---------|
| `OctaneVertical` | 1080×1920 | Vesto brand vertical video |
| `OctaneHorizontal` | 1920×1080 | Vesto brand horizontal video |
| `OverlayVertical` | 1080×1920 | Transparent overlay for footage |
| `OverlayHorizontal` | 1920×1080 | Transparent overlay for footage |

---

## video-use: Editing Raw Footage

video-use is at `C:\Users\PC\Developer\video-use`.

### How to use it
1. Place raw footage files in a folder (e.g. `C:\Videos\project\`)
2. Open Claude Code in that folder
3. Ask: *"edita estos clips en un video de lanzamiento"*

video-use will:
- Transcribe with ElevenLabs Scribe (needs `ELEVENLABS_API_KEY` in `.env`)
- Pack transcript into phrase-level markdown
- Propose an edit strategy — **you must approve before it renders**
- Cut, grade color, add 30ms audio fades, burn subtitles
- Output to `edit/final.mp4`

### Setup ElevenLabs key (one-time)
```powershell
'ELEVENLABS_API_KEY=your_key_here' | Set-Content C:\Users\PC\Developer\video-use\.env -Encoding utf8
```
Get a key at: https://elevenlabs.io/app/settings/api-keys

### Register as Claude skill (run once in PowerShell as admin or with junction permission)
```powershell
mkdir "$env:USERPROFILE\.claude\skills" -Force
cmd /c mklink /J "$env:USERPROFILE\.claude\skills\video-use" "C:\Users\PC\Developer\video-use"
```

---

## Combined Workflow: Footage + Remotion Overlays

This is the power move — video-use edits the footage, Remotion renders the overlays, ffmpeg composites them.

### Step 1 — Edit footage with video-use
```
cd C:\Videos\my-project
# Ask Claude: "edit these into a launch video with subtitles"
# → produces edit/final.mp4 and edit/subtitles.srt
```

### Step 2 — Convert SRT to Remotion subtitle props
```python
# video-use produces subtitles.srt — convert to Remotion word array:
python C:\Users\PC\Developer\video-use\helpers\pack_transcripts.py --srt edit/subtitles.srt --output-json props.json
```

### Step 3 — Render Remotion overlay
```bash
cd C:\Users\PC\Desktop\OCTANE\PROYECTOS\REMOTION\VIDEO-MAKER
node scripts/render-overlay.js --composition OverlayHorizontal --props "$(cat C:\Videos\my-project\props.json)" --out out/overlay.webm
```

### Step 4 — Composite with ffmpeg
```bash
ffmpeg -i C:\Videos\my-project\edit\final.mp4 -i out\overlay.webm \
  -filter_complex "[0:v][1:v]overlay=0:0[v]" \
  -map "[v]" -map 0:a -c:v libx264 -c:a copy \
  out\final-with-overlay.mp4
```

---

## Editing Scene Content (Vesto video)

To change what the brand video says, edit `src/data/vesto-scenes.ts`:

```typescript
// Change scenes array — each scene has:
{
  eyebrow: "ETIQUETA CORTA",  // shown as "01 / ETIQUETA"
  title: "Título principal",
  subtitle: "Subtítulo descriptivo",
  narration: "Texto de narración más largo",
  kind: "pos",  // controls which visual module renders on the right
  chips: ["Tag1", "Tag2", "Tag3"],
}
```

Available `kind` values: `chaos` `hub` `pos` `cash` `inventory` `ecommerce` `orders` `clients` `discounts` `cashback` `credit` `campaigns` `cards` `branches` `reports` `closing`

---

## Adding New Overlay Types

Create a new component in `src/overlays/` and add it to `VideoOverlay.tsx`:

```typescript
// src/overlays/MyNewOverlay.tsx
export const MyNewOverlay: React.FC<{ ... }> = ({ ... }) => { ... };

// src/overlays/VideoOverlay.tsx — add to VideoOverlayProps and render it
```

Then add a new Composition in `Root.tsx` if it needs its own render target.
