import type { Dictionary } from "./en";

// Spanish (Latin America). Tuteo throughout, and wording that doesn't
// assign vx a grammatical gender ("Ingeniería de sistemas", not
// "Ingeniero"). Quotes from English READMEs stay in English.
const es: Dictionary = {
  meta: {
    title: "vx — ingeniería de sistemas",
    description:
      "vx escribe sistemas init mínimos y herramientas de arranque en C, lo bastante pequeños para leerlos de una sentada.",
  },
  skip: "Saltar al contenido",
  nav: {
    label: "Secciones",
    language: "Idioma",
    principles: "Principios",
    work: "Trabajo",
    stack: "Herramientas",
    contact: "Contacto",
  },
  display: {
    button: "Pantalla",
    label: "Ajustes de pantalla",
    systemOn: "activado: lo pide tu sistema",
    note: "Se guarda en este dispositivo. Los ajustes de tu sistema para contraste, movimiento y pantallas de tinta electrónica se aplican solos.",
    contrast: { label: "Alto contraste", hint: "Colores sólidos, bordes más marcados" },
    motion: { label: "Reducir movimiento", hint: "Desactiva las animaciones" },
    eink: { label: "Papel (tinta electrónica)", hint: "Negro sobre blanco, para pantallas de tinta electrónica" },
    large: { label: "Texto más grande", hint: "Letra 25% más grande" },
  },
  offline: {
    down: "Estás sin conexión. Las páginas que ya abriste siguen funcionando.",
    back: "Conexión restablecida.",
  },
  hero: {
    lead: "Escribo software pensado para",
    phrases: [
      "durar más que la máquina en la que corre.",
      "caber en la cabeza de quien lo lee.",
      "hacer una sola cosa, de forma predecible.",
    ],
    lede: "Escribo sistemas init mínimos en C. El código es lo bastante pequeño para leerlo de una sentada y se apega a las interfaces POSIX siempre que puede.",
    cta: "Ver el trabajo",
    facts: [
      { k: "Rol", v: "Ingeniería de sistemas" },
      { k: "Enfoque", v: "Sistemas init, C POSIX" },
      { k: "Ahora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  principles: {
    kicker: "Principios",
    title: "Cómo construyo",
    aside: "Tres reglas que resuelven casi todas mis decisiones de diseño antes de escribir una línea.",
    items: [
      {
        title: "Estándares antes que atajos",
        body: "Interfaces POSIX antes que extensiones de un fabricante. Si un programa corre en una sola plataforma, alguien lo decidió, y esa decisión necesita una razón.",
      },
      {
        title: "Una sola tarea, predecible",
        body: "Un init que solo gestiona procesos. Un gestor de servicios que solo gestiona servicios. Cuando el alcance crece sin control, suele ser la primera señal de que algo va a dejar de ser confiable.",
      },
      {
        title: "Lo bastante pequeño para entenderlo entero",
        body: "Mejor código que te cabe en la cabeza que código en el que tienes que confiar. Si no puedo explicar por qué está una línea, se va.",
      },
    ],
  },
  work: {
    kicker: "Trabajo",
    title: "Proyectos",
    aside: "Programas pequeños que hacen una sola cosa cada uno, ordenados como se ejecutan.",
    status: {
      shipping: "disponible",
      "in progress": "en progreso",
      planned: "planeado",
    },
    spec: {
      language: "Lenguaje",
      target: "Plataforma",
      build: "Compilación",
      license: "Licencia",
      framework: "Framework",
      graphics: "Gráficos",
      hosting: "Alojamiento",
    },
    suite: {
      eyebrow: "Pila de arranque",
      body: "Una pila de arranque autocontenida en C: init, rc, logger y user, cada uno con su propio alcance y su propio README.",
      target: "Linux, BSD planeado",
      components: "Componentes",
      componentsLabel: "Componentes de 4suite",
      nodes: {
        "4init": {
          body: "PID 1 mínimo. Bloquea las señales y las lee con un signalfd, lanza 4rc con fork en su propia sesión y recoge a los procesos hijos en cada SIGCHLD. La ruta de rc está en config.h. Si falla, el kernel entra en pánico, como pasaría con cualquier init.",
          note: "Inspirado en el init mínimo de rofl0r.",
        },
        "4rc": {
          body: "El gestor de servicios que arranca 4init. Está en sus inicios: su propio README dice que “larps as being functional”.",
        },
        logger: { body: "Forma parte del alcance de la suite. Sin empezar." },
        user: { body: "Forma parte del alcance de la suite. Sin empezar." },
      },
      platforms:
        "Por ahora solo Linux. signalfd es una interfaz de Linux; el soporte para BSD está planeado.",
    },
    site: {
      eyebrow: "Este sitio",
      body: "Un export estático de Next.js servido desde Cloudflare Workers. El humo color brasa detrás de la portada es un shader WebGPU que recurre a WebGL2 y, si no, a CSS simple. La página te avisa cuando te quedas sin conexión, tiene un modo papel para pantallas de tinta electrónica y está en inglés, español y portugués.",
    },
  },
  stack: {
    kicker: "Herramientas",
    title: "Con qué trabajo",
    groups: { languages: "Lenguajes", web: "Web", tooling: "Utilidades" },
  },
  contact: {
    kicker: "Contacto",
    title: "Escríbeme",
    quote:
      "Prefiero publicar algo pequeño que entiendo por completo que algo grande cuyos límites todavía estoy descubriendo.",
    source: "Código de este sitio",
  },
  footer: { source: "Código" },
  notFound: {
    title: "Página no encontrada",
    eyebrow: "No encontrada",
    body: "No hay nada en esta dirección. El enlace puede ser viejo o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
