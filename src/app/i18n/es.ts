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
  scene: {
    hint: "Algunos píxeles hacen cosas: prueba el sol o la luna, el árbol grande y la manga de viento.",
    sky: "Cambiar entre día y noche",
    tree: "Sacudir el árbol",
    windsock: "Soplar una ráfaga de viento",
  },
  console: {
    a: "A: soplar una ráfaga de viento",
    b: "B: cambiar entre día y noche",
  },
  hero: {
    line: "Escribo software pensado para durar más que la máquina en la que corre.",
    lede: "Escribo sistemas init mínimos en C. El código es lo bastante pequeño para leerlo de una sentada y se apega a las interfaces POSIX siempre que puede.",
    facts: [
      { k: "Rol", v: "Ingeniería de sistemas" },
      { k: "Enfoque", v: "Sistemas init, C POSIX" },
      { k: "Ahora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  work: {
    title: "Trabajo",
    aside: "Programas pequeños que hacen una sola cosa cada uno, en el orden en que se ejecutan.",
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
      body: "Un export estático de Next.js servido desde Cloudflare Workers. El paisaje de arriba es pixel art: se dibuja al compilar el sitio y llega como SVG. Los árboles se mueven con un viento hecho de CSS, el sol cambia la paleta y la página está en inglés, español y portugués.",
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
  notFound: {
    title: "Página no encontrada",
    body: "No hay nada en esta dirección. El enlace puede ser viejo o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
