import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FaTruck } from "react-icons/fa";
import { FaBoxArchive, FaChartLine, FaCircleUser, FaUsers, FaUserTie } from "react-icons/fa6";
import { IoCut, IoSettingsSharp } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { RiDiscountPercentFill } from "react-icons/ri";
import { brand, clients, scenes } from "./data/vesto-scenes";
import type { VideoFormat, Scene, VisualKind } from "./data/vesto-scenes";

const fps = 30;
const sceneFrames = 168;
const outroFrames = 180;

const navItems = [
  { key: "myuser", label: "Perfil", icon: <FaCircleUser /> },
  { key: "sales", label: "Ventas", icon: <MdAttachMoney /> },
  { key: "inventary", label: "Inventario", icon: <FaBoxArchive /> },
  { key: "discounts", label: "Descuentos", icon: <RiDiscountPercentFill /> },
  { key: "customers", label: "Clientes", icon: <FaUsers /> },
  { key: "utilities", label: "Utilidades", icon: <FaChartLine /> },
  { key: "users", label: "Usuarios", icon: <FaUserTie /> },
  { key: "envios", label: "Envios", icon: <FaTruck /> },
  { key: "cut", label: "Corte", icon: <IoCut /> },
  { key: "settings", label: "Ajustes", icon: <IoSettingsSharp /> },
];

const navKeyByKind: Record<VisualKind, string> = {
  campaigns: "discounts",
  cards: "customers",
  cash: "cut",
  cashback: "customers",
  chaos: "settings",
  clients: "customers",
  closing: "settings",
  credit: "customers",
  discounts: "discounts",
  ecommerce: "envios",
  hub: "settings",
  inventory: "inventary",
  orders: "envios",
  pos: "sales",
  branches: "users",
  reports: "utilities",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const pop = (frame: number, delay = 0, stiffness = 125) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 18,
      mass: 0.85,
      stiffness,
    },
  });

const getActiveScene = (frame: number) => {
  const index = Math.min(Math.floor(frame / sceneFrames), scenes.length - 1);
  return {
    index,
    localFrame: frame - index * sceneFrames,
    scene: scenes[index],
  };
};

const BrandLogo: React.FC<{ inverse?: boolean; size?: number }> = ({
  inverse = false,
  size = 92,
}) => (
  <Img
    src={staticFile(inverse ? "brand/vesto-logo.png" : "brand/vesto-logo.png")}
    style={{
      background: inverse ? brand.black : "transparent",
      borderRadius: inverse ? 10 : 0,
      height: size,
      objectFit: "contain",
      width: size * 1.45,
    }}
  />
);

const IconGlyph: React.FC<{
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}> = ({
  active = false,
  icon,
  label,
}) => (
  <div
    style={{
      alignItems: "center",
      background: active ? brand.card : "transparent",
      borderRadius: 10,
      color: active ? brand.primary : brand.card,
      display: "flex",
      fontSize: 24,
      fontWeight: 900,
      height: 52,
      justifyContent: "center",
      position: "relative",
      width: 52,
    }}
  >
    <div style={{ display: "flex", fontSize: 28 }}>{icon}</div>
    {active && (
      <div
        style={{
          background: brand.black,
          borderRadius: 8,
          color: brand.card,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: 18,
          fontWeight: 900,
          left: 62,
          letterSpacing: "0.04em",
          padding: "8px 10px",
          position: "absolute",
          textTransform: "uppercase",
          top: "50%",
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    )}
  </div>
);

const Sidebar: React.FC<{ sceneKind: VisualKind }> = ({ sceneKind }) => {
  const activeKey = navKeyByKind[sceneKind];

  return (
    <div
      style={{
        alignItems: "center",
        background: brand.black,
        borderRadius: 10,
        bottom: 18,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        left: 18,
        padding: "18px 10px",
        position: "absolute",
        top: 18,
        width: 76,
        zIndex: 6,
      }}
    >
      <BrandLogo inverse size={48} />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {navItems.map((item) => (
          <IconGlyph
            key={item.key}
            active={activeKey === item.key}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
};

const Backdrop: React.FC<{ localFrame: number }> = ({
  localFrame,
}) => (
  <AbsoluteFill
    style={{
      background: brand.bg,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(17,24,39,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.035) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        inset: -80,
        opacity: 0.65,
        position: "absolute",
        transform: `translate(${localFrame * -0.18}px, ${localFrame * 0.12}px)`,
      }}
    />
    <div
      style={{
        background: brand.primary,
        filter: "blur(80px)",
        height: 420,
        opacity: 0.08,
        position: "absolute",
        right: -150,
        top: 90,
        transform: `translateY(${Math.sin(localFrame / 22) * 45}px)`,
        width: 520,
      }}
    />
    <div
      style={{
        background: brand.gold,
        bottom: -130,
        filter: "blur(90px)",
        height: 330,
        left: 160,
        opacity: 0.1,
        position: "absolute",
        width: 520,
      }}
    />
  </AbsoluteFill>
);

const TextBlock: React.FC<{
  scene: Scene;
  index: number;
  localFrame: number;
  format: VideoFormat;
}> = ({ scene, index, localFrame, format }) => {
  const wide = format === "horizontal";
  const inA = pop(localFrame, 4);
  const inB = pop(localFrame, 20);

  return (
    <div
      style={{
        alignSelf: "center",
        color: brand.ink,
        paddingLeft: wide ? 24 : 0,
        transform: `translateY(${interpolate(inA, [0, 1], [54, 0])}px)`,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 14,
          marginBottom: wide ? 22 : 28,
        }}
      >
        <div
          style={{
            background: brand.primary,
            height: 10,
            width: 42,
          }}
        />
        <div
          style={{
            color: brand.primary,
            fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
            fontSize: wide ? 24 : 30,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {scene.eyebrow}
        </div>
      </div>
      <h1
        style={{
          color: brand.ink,
          fontFamily: "Barlow Condensed, Impact, Arial Narrow, sans-serif",
          fontSize: wide ? 82 : 96,
          fontWeight: 800,
          letterSpacing: "0.02em",
          lineHeight: 0.92,
          margin: 0,
          maxWidth: wide ? 760 : 900,
          opacity: inA,
          textTransform: "uppercase",
        }}
      >
        {scene.title}
      </h1>
      <p
        style={{
          color: brand.ink,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: wide ? 35 : 42,
          fontWeight: 650,
          lineHeight: 1.08,
          margin: wide ? "30px 0 0" : "36px 0 0",
          maxWidth: wide ? 710 : 890,
          opacity: inB,
        }}
      >
        {scene.subtitle}
      </p>
      <p
        style={{
          borderLeft: `5px solid ${brand.primary}`,
          color: brand.muted,
          fontFamily: "Readex Pro, Segoe UI, Arial, sans-serif",
          fontSize: wide ? 20 : 26,
          lineHeight: 1.34,
          margin: wide ? "30px 0 0" : "36px 0 0",
          maxWidth: wide ? 720 : 900,
          opacity: pop(localFrame, 42),
          paddingLeft: 18,
        }}
      >
        {scene.narration}
      </p>
    </div>
  );
};

const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  localFrame: number;
  variant?: "red" | "black" | "gold" | "neutral";
}> = ({ children, delay = 0, localFrame, variant = "neutral" }) => {
  const amount = pop(localFrame, delay, 115);
  const palette = {
    black: { bg: brand.black, fg: brand.card, border: brand.black },
    gold: { bg: "#fffbeb", fg: "#713f12", border: "#fbbf24" },
    neutral: { bg: brand.card, fg: brand.ink, border: brand.line },
    red: { bg: brand.primary, fg: brand.card, border: brand.primary },
  }[variant];

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 999,
        color: palette.fg,
        display: "inline-flex",
        fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: "0.03em",
        margin: 7,
        opacity: amount,
        padding: "9px 16px",
        textTransform: "uppercase",
        transform: `translateY(${interpolate(amount, [0, 1], [26, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const ClientSwitcher: React.FC<{ localFrame: number; compact?: boolean }> = ({
  compact = false,
  localFrame,
}) => {
  const active = Math.floor(localFrame / 46) % clients.length;

  return (
    <div
      style={{
        background: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: 14,
        boxShadow: "0 8px 24px rgba(17,24,39,0.08)",
        display: "grid",
        gap: compact ? 8 : 10,
        padding: compact ? 10 : 14,
      }}
    >
      <div
        style={{
          color: brand.muted,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: compact ? 16 : 20,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Clientes conectados
      </div>
      {clients.map((client, index) => {
        const isActive = index === active;

        return (
          <div
            key={client.name}
            style={{
              alignItems: "center",
              background: isActive ? brand.black : "#f8f9fa",
              border: `1px solid ${isActive ? brand.black : brand.line}`,
              borderRadius: 10,
              color: isActive ? brand.card : brand.ink,
              display: "grid",
              gap: 10,
              gridTemplateColumns: "18px 64px 1fr",
              padding: compact ? "8px 10px" : "10px 12px",
            }}
          >
            <div
              style={{
                background: client.color,
                borderRadius: "50%",
                height: 14,
                width: 14,
              }}
            />
            <strong
              style={{
                fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
                fontSize: compact ? 19 : 24,
                letterSpacing: "0.04em",
              }}
            >
              {client.name}
            </strong>
            <span
              style={{
                color: isActive ? "rgba(255,255,255,0.7)" : brand.muted,
                fontFamily: "Readex Pro, Segoe UI, Arial, sans-serif",
                fontSize: compact ? 13 : 15,
              }}
            >
              {client.store}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ProductCard: React.FC<{ localFrame: number; compact?: boolean }> = ({
  localFrame,
  compact = false,
}) => {
  const amount = pop(localFrame, 12);

  return (
    <div
      style={{
        background: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        overflow: "hidden",
        padding: compact ? 10 : 14,
        transform: `scale(${interpolate(amount, [0, 1], [0.88, 1])})`,
        width: compact ? 190 : 240,
      }}
    >
      <Img
        src={staticFile("brand/products.webp")}
        style={{
          aspectRatio: "3 / 4",
          background: "#f5f5f5",
          borderRadius: 6,
          height: compact ? 185 : 245,
          objectFit: "cover",
          width: "100%",
        }}
      />
      <div
        style={{
          color: brand.ink,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: compact ? 18 : 24,
          fontWeight: 800,
          letterSpacing: "0.04em",
          lineHeight: 1.08,
          marginTop: 13,
          textTransform: "uppercase",
        }}
      >
        Cinch gorra guinda ajustable
      </div>
      <div
        style={{
          color: brand.clientRed,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: compact ? 22 : 28,
          fontWeight: 900,
          marginTop: 10,
        }}
      >
        $798.00
      </div>
    </div>
  );
};

const PosShell: React.FC<{
  children: React.ReactNode;
  localFrame: number;
  title?: string;
}> = ({ children, localFrame, title = "Carrito de compras" }) => {
  const amount = pop(localFrame, 10);

  return (
    <div
      style={{
        background: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: 18,
        boxShadow: "0 10px 30px rgba(17,24,39,0.12)",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        minHeight: 610,
        overflow: "hidden",
        transform: `translateY(${interpolate(amount, [0, 1], [40, 0])}px) scale(${interpolate(amount, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `1px solid ${brand.line}`,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            color: brand.ink,
            fontFamily: "Roboto Slab, Georgia, serif",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: brand.clientRed,
            fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            position: "absolute",
            right: 28,
            textTransform: "uppercase",
          }}
        >
          RML
        </div>
      </div>
      <div
        style={{
          background: "#f8f9fa",
          padding: 26,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const BarChart: React.FC<{ localFrame: number }> = ({ localFrame }) => (
  <div
    style={{
      alignItems: "flex-end",
      display: "flex",
      gap: 14,
      height: 220,
      marginTop: 20,
    }}
  >
    {[0.42, 0.72, 0.58, 0.92, 0.76, 1].map((height, index) => {
      const amount = interpolate(localFrame, [20 + index * 9, 72 + index * 9], [0, height], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      return (
        <div
          key={height}
          style={{
            background: index === 5 ? brand.primary : "#d1d5db",
            borderRadius: "8px 8px 0 0",
            height: `${amount * 100}%`,
            width: 48,
          }}
        />
      );
    })}
  </div>
);

const CartPanel: React.FC<{ localFrame: number }> = ({ localFrame }) => (
  <div
    style={{
      background: brand.card,
      border: `1px solid ${brand.line}`,
      borderRadius: 18,
      boxShadow: "0 10px 30px rgba(17,24,39,0.12)",
      display: "grid",
      gridTemplateRows: "150px 1fr 170px",
      minHeight: 610,
      overflow: "hidden",
      padding: 0,
    }}
  >
    <div
      style={{
        alignItems: "center",
        borderBottom: `1px solid ${brand.line}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <BrandLogo size={82} />
      <div style={{ color: brand.ink, fontSize: 22 }}>Viernes, 5 de junio</div>
    </div>
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            color: brand.ink,
            fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          Cinch gorra guinda ajustable
        </div>
        <div
          style={{
            color: brand.ink,
            fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          $798.00
        </div>
      </div>
      <div>
        <Chip localFrame={localFrame} variant="neutral">
          Unitalla
        </Chip>
        <Chip delay={8} localFrame={localFrame} variant="red">
          Rojo
        </Chip>
      </div>
      <div
        style={{
          alignItems: "center",
          border: `1px solid ${brand.line}`,
          borderRadius: 8,
          color: brand.ink,
          display: "inline-flex",
          fontSize: 26,
          fontWeight: 900,
          gap: 26,
          marginTop: 20,
          padding: "8px 18px",
        }}
      >
        <span style={{ color: "#9ca3af" }}>-</span>
        <span>1</span>
        <span>+</span>
      </div>
    </div>
    <div
      style={{
        borderTop: `1px solid ${brand.line}`,
        padding: 24,
      }}
    >
      <div
        style={{
          color: brand.muted,
          fontFamily: "Roboto Slab, Georgia, serif",
          fontSize: 25,
          fontWeight: 800,
        }}
      >
        Subtotal: $798.00
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        <div style={{ color: brand.ink, fontSize: 38, fontWeight: 900 }}>Total:</div>
        <div style={{ color: brand.ink, fontSize: 42, fontWeight: 950 }}>$798.00</div>
      </div>
      <div
        style={{
          background: brand.black,
          borderRadius: 12,
          color: brand.card,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: 34,
          fontWeight: 900,
          marginTop: 20,
          padding: "16px 24px",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Cobrar
      </div>
    </div>
  </div>
);

const PromoTicket: React.FC<{ localFrame: number; label: string; delay: number }> = ({
  delay,
  label,
  localFrame,
}) => {
  const amount = pop(localFrame, delay);

  return (
    <div
      style={{
        background: brand.cream,
        border: "1.5px solid #e0d5c0",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        color: brand.ink,
        display: "grid",
        gridTemplateColumns: "96px 1fr",
        minHeight: 96,
        opacity: amount,
        overflow: "hidden",
        transform: `translateX(${interpolate(amount, [0, 1], [70, 0])}px)`,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: `linear-gradient(160deg, ${brand.clientRed}, ${brand.clientRedDark})`,
          color: brand.card,
          display: "flex",
          fontFamily: "Georgia, serif",
          fontSize: 25,
          fontWeight: 900,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        RML
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: 29,
          fontWeight: 900,
          letterSpacing: "0.03em",
          padding: 18,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const ModuleVisual: React.FC<{
  scene: Scene;
  localFrame: number;
  format: VideoFormat;
}> = ({ scene, localFrame, format }) => {
  const wide = format === "horizontal";

  if (scene.kind === "closing") {
    return (
      <div
        style={{
          alignItems: "center",
          background: brand.black,
          borderRadius: 18,
          color: brand.card,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: wide ? 610 : 690,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <BrandLogo inverse size={190} />
        <div
          style={{
            color: brand.card,
            fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
            fontSize: wide ? 82 : 92,
            fontWeight: 900,
            letterSpacing: "0.04em",
            marginTop: 26,
            textTransform: "uppercase",
          }}
        >
          Vesto
        </div>
        <div
          style={{
            background: brand.primary,
            borderRadius: 12,
            color: brand.card,
            fontSize: 28,
            fontWeight: 900,
            marginTop: 34,
            padding: "16px 24px",
            textTransform: "uppercase",
          }}
        >
          Agenda una demostracion
        </div>
      </div>
    );
  }

  if (scene.kind === "ecommerce") {
    return (
      <div
        style={{
          display: "grid",
          gap: 22,
          gridTemplateColumns: wide ? "0.85fr 1.15fr" : "1fr",
        }}
      >
        <div
          style={{
            background: brand.black,
            borderRadius: 24,
            minHeight: wide ? 610 : 360,
            overflow: "hidden",
            padding: 26,
          }}
        >
          <Img
            src={staticFile("brand/store-front.webp")}
            style={{
              borderRadius: 14,
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
              width: "100%",
            }}
          />
        </div>
        <CartPanel localFrame={localFrame} />
      </div>
    );
  }

  if (scene.kind === "pos") {
    return (
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: wide ? "0.9fr 1.1fr" : "1fr",
        }}
      >
        <PosShell localFrame={localFrame}>
          <ProductCard localFrame={localFrame} />
          <div style={{ bottom: 26, left: 26, position: "absolute" }} />
        </PosShell>
        <CartPanel localFrame={localFrame} />
      </div>
    );
  }

  return (
    <PosShell
      localFrame={localFrame}
      title={
        scene.kind === "cash"
          ? "Corte de caja"
          : scene.kind === "reports"
            ? "Dashboard"
            : scene.kind === "inventory"
              ? "Inventario"
              : scene.kind === "orders"
                ? "Pedidos"
                : "Panel Vesto"
      }
    >
      {scene.kind === "chaos" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            paddingTop: 30,
          }}
        >
          {scene.chips.map((chip, index) => (
            <Chip
              key={chip}
              delay={index * 7}
              localFrame={localFrame}
              variant={index % 3 === 0 ? "red" : index % 3 === 1 ? "black" : "neutral"}
            >
              {chip}
            </Chip>
          ))}
        </div>
      )}
      {scene.kind === "hub" && (
        <div
          style={{
            alignItems: "center",
            display: "grid",
            gap: 24,
            justifyItems: "center",
            minHeight: 500,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: brand.black,
              borderRadius: "50%",
              color: brand.card,
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 120,
              fontWeight: 900,
              height: 220,
              justifyContent: "center",
              width: 220,
            }}
          >
            V
          </div>
          <div>
            {scene.chips.map((chip, index) => (
              <Chip
                key={chip}
                delay={index * 9}
                localFrame={localFrame}
                variant={index === 0 ? "red" : "neutral"}
              >
                {chip}
              </Chip>
            ))}
          </div>
          <ClientSwitcher compact localFrame={localFrame} />
        </div>
      )}
      {scene.kind === "cash" && (
        <>
          {["Ventas del dia $18,420", "Efectivo esperado $7,250", "Arqueo correcto"].map(
            (item, index) => (
              <Chip
                key={item}
                delay={index * 14}
                localFrame={localFrame}
                variant={index === 2 ? "red" : "neutral"}
              >
                {item}
              </Chip>
            ),
          )}
          <BarChart localFrame={localFrame} />
        </>
      )}
      {scene.kind === "inventory" && (
        <div>
          <ProductCard compact localFrame={localFrame} />
          <div
            style={{
              color: brand.clientRed,
              fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
              fontSize: 112,
              fontWeight: 950,
              marginTop: 30,
            }}
          >
            {"5 -> 4"}
          </div>
          <Chip localFrame={localFrame} variant="black">
            POS y ecommerce sincronizados
          </Chip>
        </div>
      )}
      {scene.kind === "orders" && (
        <div style={{ display: "grid", gap: 18, paddingTop: 30 }}>
          {scene.chips.map((chip, index) => (
            <div
              key={chip}
              style={{
                background: localFrame > 24 + index * 25 ? brand.clientRed : brand.card,
                border: `1px solid ${brand.line}`,
                borderRadius: 12,
                color: localFrame > 24 + index * 25 ? brand.card : brand.ink,
                fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
                fontSize: 34,
                fontWeight: 900,
                padding: "18px 22px",
                textTransform: "uppercase",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      )}
      {scene.kind === "reports" && (
        <>
          <BarChart localFrame={localFrame} />
          <div style={{ marginTop: 26 }}>
            {scene.chips.map((chip, index) => (
              <Chip
                key={chip}
                delay={index * 10}
                localFrame={localFrame}
                variant={index === 2 ? "gold" : "neutral"}
              >
                {chip}
              </Chip>
            ))}
          </div>
        </>
      )}
      {scene.kind === "discounts" && (
        <div style={{ display: "grid", gap: 18, paddingTop: 22 }}>
          {scene.chips.map((chip, index) => (
            <PromoTicket
              key={chip}
              delay={index * 12}
              label={chip}
              localFrame={localFrame}
            />
          ))}
        </div>
      )}
      {["clients", "cashback", "credit", "campaigns", "cards", "branches"].indexOf(
        scene.kind,
      ) !== -1 && (
        <div style={{ paddingTop: 28 }}>
          {scene.chips.map((chip, index) => (
            <Chip
              key={chip}
              delay={index * 9}
              localFrame={localFrame}
              variant={index === 0 ? "red" : index === 1 ? "black" : "neutral"}
            >
              {chip}
            </Chip>
          ))}
          <div
            style={{
              background: scene.kind === "credit" || scene.kind === "campaigns" ? "#eafaf1" : brand.card,
              border: `1px solid ${brand.line}`,
              borderRadius: 14,
              color: brand.ink,
              fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
              fontSize: 34,
              fontWeight: 850,
              marginTop: 32,
              minHeight: 210,
              padding: 26,
              textTransform: "uppercase",
            }}
          >
            {scene.kind === "clients" && "Perfil + historial + preferencias"}
            {scene.kind === "cashback" && "Saldo disponible para recompra"}
            {scene.kind === "credit" && "WhatsApp enviado automaticamente"}
            {scene.kind === "campaigns" && "Nueva coleccion disponible"}
            {scene.kind === "cards" && "Tarjeta escaneada. Perfil encontrado."}
            {scene.kind === "branches" && "Centro + Norte + Online conectadas"}
          </div>
        </div>
      )}
    </PosShell>
  );
};

const ProgressRail: React.FC<{ index: number; localFrame: number }> = ({
  index,
  localFrame,
}) => {
  const progress = clamp(localFrame / sceneFrames, 0, 1);

  return (
    <div
      style={{
        bottom: 30,
        display: "flex",
        gap: 7,
        left: 126,
        position: "absolute",
        right: 50,
        zIndex: 5,
      }}
    >
      {scenes.map((scene, sceneIndex) => (
        <div
          key={scene.eyebrow}
          style={{
            background: "#d1d5db",
            borderRadius: 99,
            flex: 1,
            height: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: sceneIndex === index ? brand.primary : "#9ca3af",
              height: "100%",
              transform: `scaleX(${
                sceneIndex < index ? 1 : sceneIndex === index ? progress : 0
              })`,
              transformOrigin: "left",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const TenantBadge: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const amount = pop(localFrame, 18);

  return (
    <div
      style={{
        alignItems: "center",
        background: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: 999,
        boxShadow: "0 8px 24px rgba(17,24,39,0.08)",
        color: brand.ink,
        display: "flex",
        gap: 12,
        opacity: amount,
        padding: "10px 16px",
        position: "absolute",
        right: 78,
        top: 30,
        transform: `translateY(${interpolate(amount, [0, 1], [-18, 0])}px)`,
        zIndex: 7,
      }}
    >
      <span
        style={{
          background: brand.black,
          borderRadius: 999,
          color: brand.card,
          fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif",
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: "0.08em",
          padding: "7px 10px",
          textTransform: "uppercase",
        }}
      >
        Vesto OS
      </span>
      <span
        style={{
          background: brand.clientRed,
          borderRadius: "50%",
          height: 12,
          width: 12,
        }}
      />
      <span
        style={{
          color: brand.muted,
          fontFamily: "Readex Pro, Segoe UI, Arial, sans-serif",
          fontSize: 16,
        }}
      >
        Tenant activo: RML Store
      </span>
    </div>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const distance = frame % sceneFrames;
  const opacity = Math.max(
    interpolate(distance, [0, 8], [0.18, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(distance, [sceneFrames - 8, sceneFrames], [0, 0.16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill
      style={{
        background: brand.primary,
        mixBlendMode: "multiply",
        opacity,
      }}
    />
  );
};

export const MyComposition: React.FC<{ format?: VideoFormat }> = ({
  format = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { index, localFrame, scene } = getActiveScene(frame);
  const wide = format === "horizontal";
  const contentScale = interpolate(localFrame, [sceneFrames - 18, sceneFrames], [1, 0.975], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "Readex Pro, Barlow Condensed, Segoe UI, Helvetica, Arial, sans-serif",
      }}
    >
      <Backdrop localFrame={localFrame} />
      <Sidebar sceneKind={scene.kind} />
      <TenantBadge localFrame={localFrame} />
      <AbsoluteFill
        style={{
          display: "grid",
          gap: wide ? 54 : 36,
          gridTemplateColumns: wide ? "0.85fr 1.15fr" : "1fr",
          padding: wide ? "72px 78px 76px 126px" : "92px 54px 92px 126px",
          transform: `scale(${contentScale})`,
        }}
      >
        <TextBlock
          format={format}
          index={index}
          localFrame={localFrame}
          scene={scene}
        />
        <ModuleVisual
          format={format}
          localFrame={localFrame}
          scene={scene}
        />
      </AbsoluteFill>
      <ProgressRail index={index} localFrame={localFrame} />
      <Flash />
    </AbsoluteFill>
  );
};

export const videoDurationInFrames =
  sceneFrames * (scenes.length - 1) + outroFrames;
