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
    lede: "Programas pequeños que hacen una sola cosa cada uno, usan interfaces POSIX siempre que pueden y son lo bastante cortos para leerlos de una sentada.",
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
      body: "Una pila de arranque autocontenida en C, hecha de cuatro programas pequeños: init, rc, logger y user.",
      target: "Linux, BSD planeado",
      components: "Componentes",
      nodes: {
        "4init": "PID 1 mínimo. Bloquea las señales y las lee con un signalfd, lanza 4rc con fork en su propia sesión y recoge a los procesos hijos en cada SIGCHLD. Inspirado en el init mínimo de rofl0r.",
        "4rc": "El gestor de servicios que 4init arranca por defecto. Está en sus inicios.",
      },
    },
    site: {
      body: "Un export estático de Next.js servido desde Cloudflare Workers, en inglés, español y portugués. La raíz elige el idioma en el edge y la página sigue el modo claro u oscuro de tu sistema.",
    },
  },
  principles: {
    title: "Principios",
    items: [
      {
        title: "Estándares antes que atajos",
        body: "Interfaces POSIX antes que extensiones de un fabricante. Todo lo que dependa de una plataforma necesita una razón explícita.",
      },
      {
        title: "Una sola tarea, predecible",
        body: "Un init que solo gestiona procesos y un gestor de servicios que solo gestiona servicios. El resto de la pila está planeado como programas aparte.",
      },
      {
        title: "Lo bastante pequeño para entenderlo entero",
        body: "Si no puedo explicar por qué está una línea, se va.",
      },
    ],
  },
  stack: {
    title: "Herramientas",
    groups: { languages: "Lenguajes", web: "Web", tooling: "Utilidades" },
  },
  contact: {
    title: "Contacto",
    line: "Todo el trabajo de arriba es público en GitHub.",
  },
  footer: {
    source: "Código de este sitio",
    top: "Volver arriba",
  },
  notFound: {
    title: "Página no encontrada",
    body: "No hay nada en esta dirección. El enlace puede ser viejo o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
