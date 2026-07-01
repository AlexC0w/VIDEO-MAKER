# Octane Video Maker

Proyecto Remotion para generar videos animados con React, TypeScript y Tailwind.

Incluye una plantilla visual con:

- Formato vertical `1080x1920` para Reels, Shorts y TikTok.
- Formato horizontal `1920x1080` para YouTube y promos.
- Intro con kinetic typography, glitch, flashes y fondo animado.
- Escenas reutilizables basadas en datos.
- Transiciones por corte y salida tipo CTA.

## Comandos

```console
npm install
npm run dev
```

Render vertical:

```console
npm run render:vertical
```

Render horizontal:

```console
npm run render:horizontal
```

Validar TypeScript y ESLint:

```console
npm run lint
```

## Editar el video

La plantilla vive en `src/Composition.tsx`. Cambia el objeto `videoData` para generar otra version:

- `brand`: nombre de marca o proyecto.
- `hook`: frase principal del inicio.
- `subHook`: texto secundario.
- `stats`: etiquetas del intro.
- `scenes`: bloques animados del video.
- `cta`: cierre final.

Las composiciones registradas estan en `src/Root.tsx`:

- `OctaneVertical`
- `OctaneHorizontal`
