export type VideoFormat = "vertical" | "horizontal";

export type VisualKind =
  | "chaos"
  | "hub"
  | "pos"
  | "cash"
  | "inventory"
  | "ecommerce"
  | "orders"
  | "clients"
  | "discounts"
  | "cashback"
  | "credit"
  | "campaigns"
  | "cards"
  | "branches"
  | "reports"
  | "closing";

export type Scene = {
  eyebrow: string;
  title: string;
  subtitle: string;
  narration: string;
  kind: VisualKind;
  chips: string[];
};

export const brand = {
  primary: "#000000",
  primarySoft: "#111111",
  clientRed: "#A4100D",
  clientRedDark: "#6E0200",
  clientBlue: "#1f4f8f",
  clientGreen: "#1f7a4d",
  gold: "#ffd700",
  goldDark: "#CC9A1C",
  black: "#000000",
  ink: "#111827",
  muted: "#6b7280",
  line: "#e5e7eb",
  bg: "#f4f6f8",
  card: "#ffffff",
  cream: "#FFFDF7",
  leather: "#2a1a0e",
};

export const clients = [
  { name: "RML", store: "Rodeo My Lifestyle", color: brand.clientRed },
  { name: "Florann", store: "Moda boutique", color: brand.clientBlue },
  { name: "Demo", store: "Tienda urbana", color: brand.clientGreen },
];

export const scenes: Scene[] = [
  {
    eyebrow: "Problema",
    title: "Cada tienda opera distinto.",
    subtitle: "Pero todas necesitan vender, controlar y crecer sin desorden.",
    narration:
      "Cuando ventas, inventario, pedidos y clientes viven separados, la operacion se vuelve lenta y dificil de escalar.",
    kind: "chaos",
    chips: ["Inventario", "Ventas", "Pedidos", "Caja", "Clientes", "Descuentos"],
  },
  {
    eyebrow: "Vesto",
    title: "Vesto conecta la operacion.",
    subtitle: "Una plataforma, multiples clientes, marcas y flujos de venta.",
    narration:
      "Cada negocio conserva su identidad visual, mientras Vesto centraliza POS, e-commerce, inventario, clientes y reportes.",
    kind: "hub",
    chips: ["POS", "E-commerce", "Caja", "Clientes", "Reportes"],
  },
  {
    eyebrow: "POS",
    title: "El mostrador se vuelve rapido.",
    subtitle: "Productos, carrito, variantes, cobro y ticket en una sola pantalla.",
    narration:
      "Vende rapido en mostrador y controla variantes sin hojas sueltas ni capturas.",
    kind: "pos",
    chips: ["S", "M", "L", "XL", "Rojo", "Negro", "Beige"],
  },
  {
    eyebrow: "Caja",
    title: "La caja queda clara.",
    subtitle: "Entradas, retiros, cortes y arqueos con trazabilidad.",
    narration:
      "Con apertura, corte de caja y arqueo sabes cuanto vendiste y que paso durante el dia.",
    kind: "cash",
    chips: ["Apertura", "Ventas del dia", "Efectivo esperado", "Arqueo"],
  },
  {
    eyebrow: "Inventario",
    title: "El inventario se sincroniza.",
    subtitle: "Cada venta mueve stock por variante en tienda fisica y online.",
    narration:
      "Evita errores, sobreventas y confusiones entre sucursal, mostrador y e-commerce.",
    kind: "inventory",
    chips: ["Vestido azul", "Talla M", "Stock 5", "Stock 4"],
  },
  {
    eyebrow: "E-commerce",
    title: "La marca tambien vende online.",
    subtitle: "Catalogo, carrito, checkout, pagos, pedidos y envios.",
    narration:
      "Vesto tambien incluye e-commerce para vender en linea con una experiencia completa.",
    kind: "ecommerce",
    chips: ["Catalogo", "Carrito", "Stripe", "Pedido recibido"],
  },
  {
    eyebrow: "Pedidos",
    title: "Los pedidos tienen flujo.",
    subtitle: "Nuevo, pagado, preparando y enviado en un solo flujo.",
    narration:
      "Prepara envios de forma ordenada sin perder conversaciones ni depender de screenshots.",
    kind: "orders",
    chips: ["Nuevo", "Pagado", "Preparando", "Enviado"],
  },
  {
    eyebrow: "Clientes",
    title: "Cada cliente deja contexto.",
    subtitle: "Historial, preferencias, saldo y compras anteriores.",
    narration:
      "Registra clientes y crea una relacion mas inteligente con cada compra.",
    kind: "clients",
    chips: ["Vestido negro", "Botas cafes", "Bolsa beige", "Promo de temporada"],
  },
  {
    eyebrow: "Promos",
    title: "Las promociones se gobiernan.",
    subtitle: "Por producto, marca, tipo de prenda, porcentaje, monto fijo o temporada.",
    narration:
      "Crea reglas comerciales flexibles para vender mas sin improvisar descuentos.",
    kind: "discounts",
    chips: ["Chamarras -40%", "2x1 seleccionadas", "Outlet invierno"],
  },
  {
    eyebrow: "Fidelizacion",
    title: "La recompra se vuelve medible.",
    subtitle: "Cashback, saldo disponible y recompra.",
    narration:
      "Tus clientas pueden acumular saldo, usar dinero electronico y volver a comprar contigo.",
    kind: "cashback",
    chips: ["Compra $1,200", "Cashback +$60", "Saldo $240"],
  },
  {
    eyebrow: "Credito",
    title: "El credito deja de vivir en notas.",
    subtitle: "Saldos, pagos, vencimientos y recordatorios por WhatsApp.",
    narration:
      "Si manejas credito interno, Vesto ayuda a controlar cuentas y enviar recordatorios automaticos.",
    kind: "credit",
    chips: ["Saldo $850", "Vence 15 feb", "Mensaje enviado"],
  },
  {
    eyebrow: "Campanas",
    title: "Las campanas salen segmentadas.",
    subtitle: "WhatsApp a segmentos especificos de tus clientas.",
    narration:
      "Envia campanas a clientas frecuentes, inactivas, nuevas o compradoras de categorias especificas.",
    kind: "campaigns",
    chips: ["Clientas frecuentes", "Nueva coleccion", "Enviado"],
  },
  {
    eyebrow: "Tarjetas",
    title: "La atencion reconoce a la clienta.",
    subtitle: "Tarjetas fisicas, codigo de barras o NFC en mostrador.",
    narration:
      "Identifica clientas, consulta beneficios y acelera la atencion en caja.",
    kind: "cards",
    chips: ["Escaneo", "Perfil instantaneo", "Beneficios"],
  },
  {
    eyebrow: "Multi-sucursal",
    title: "Cuando el negocio crece.",
    subtitle: "Sucursales, cajas, online e inventario siguen conectados.",
    narration:
      "Vesto crece contigo: varias sucursales, cajas, inventario compartido y reportes consolidados.",
    kind: "branches",
    chips: ["Centro", "Norte", "Online", "Dashboard central"],
  },
  {
    eyebrow: "Reportes",
    title: "La decision sale del dato.",
    subtitle: "Ventas, caja, inventario, clientes y operacion en dashboards claros.",
    narration:
      "Consulta indicadores para tomar mejores decisiones en cada area de la tienda.",
    kind: "reports",
    chips: ["Vestido rojo", "Tienda fisica", "Stock bajo talla M"],
  },
  {
    eyebrow: "Cierre",
    title: "Cada marca vende a su manera.",
    subtitle: "Vesto sostiene la operacion.",
    narration:
      "Una plataforma hecha para que tiendas de moda vendan, controlen y crezcan.",
    kind: "closing",
    chips: ["Agenda una demostracion", "Vesto by Octane"],
  },
];
