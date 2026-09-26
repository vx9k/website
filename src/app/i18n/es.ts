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
    work: "Trabajo",
    principles: "Principios",
    stack: "Herramientas",
    contact: "Contacto",
  },
  hero: {
    line: "Sistemas init y herramientas de arranque en C.",
    lede: "Programas pequeños que hacen una sola cosa cada uno, usan interfaces POSIX siempre que pueden y son lo bastante cortos para leerlos de una sentada. El proyecto actual es 4suite, una pila de arranque autocontenida para Linux.",
    facts: [
      { k: "Rol", v: "Ingeniería de sistemas" },
      { k: "Enfoque", v: "Sistemas init, C POSIX" },
      { k: "Ahora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  work: {
    title: "Trabajo",
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
      styling: "Estilos",
      hosting: "Alojamiento",
    },
    suite: {
      body: "Una pila de arranque autocontenida en C: init, rc, logger y user, cada uno con su propio alcance y su propio README.",
      target: "Linux, BSD planeado",
      platforms: "Por ahora solo Linux. signalfd es una interfaz de Linux; el soporte para BSD está planeado.",
      components: "Componentes",
      nodes: {
        "4init": "PID 1 mínimo. Bloquea las señales y las lee con un signalfd, lanza 4rc con fork en su propia sesión y recoge a los procesos hijos en cada SIGCHLD. Inspirado en el init mínimo de rofl0r.",
        "4rc": "El gestor de servicios que arranca 4init. Está en sus inicios: su propio README dice que “larps as being functional”.",
        logger: "Forma parte del alcance de la suite. Sin empezar.",
        user: "Forma parte del alcance de la suite. Sin empezar.",
      },
    },
    site: {
      body: "Un export estático de Next.js servido desde Cloudflare Workers, en inglés, español y portugués. La raíz elige el idioma en el edge y la página sigue el modo claro u oscuro de tu sistema.",
    },
  },
  principles: {
    title: "Principios",
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
  stack: {
    title: "Herramientas",
    groups: { languages: "Lenguajes", web: "Web", tooling: "Utilidades" },
  },
  contact: {
    title: "Contacto",
    quote:
      "Prefiero publicar algo pequeño que entiendo por completo que algo grande cuyos límites todavía estoy descubriendo.",
    source: "Código de este sitio",
  },
  footer: {
    top: "Volver arriba",
  },
  notFound: {
    title: "Página no encontrada",
    body: "No hay nada en esta dirección. El enlace puede ser viejo o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
