import type { Dictionary } from "./en";

// Spanish (Latin America). Tuteo throughout, and wording that doesn't
// assign vx a grammatical gender ("Ingeniería de software", not
// "Ingeniero"). Quotes from English READMEs stay in English.
const es: Dictionary = {
  meta: {
    title: "vx — ingeniería de software",
    description: "vx vive en Uruguay y escribe C para Linux y TypeScript para la web.",
  },
  skip: "Saltar al contenido",
  nav: {
    label: "Secciones",
    language: "Idioma",
    skills: "Habilidades",
    principles: "Principios",
    contact: "Contacto",
  },
  hero: {
    status: "Disponible para trabajar",
    line: "Soy vx y me dedico a la ingeniería de software en Uruguay.",
    lede: "Escribo C para Linux, hasta el PID 1, y TypeScript para la web, como este sitio. Me interesa cómo funcionan las cosas por dentro, de las capas de red a los modelos de lenguaje.",
  },
  skills: {
    title: "Habilidades",
    groups: { languages: "Lenguajes", web: "Web", networking: "Redes", ai: "IA" },
    names: { asm: "Ensamblador x86", llm: "Cómo funcionan los LLM", ai: "Trabajar con IA" },
    notes: { l23: "Enlace de datos, red", l4: "Transporte", l67: "Presentación, aplicación" },
  },
  principles: {
    title: "Principios",
    quote: "Programas pequeños que hacen una sola cosa cada uno, usan interfaces POSIX siempre que pueden y son lo bastante cortos para leerlos de una sentada.",
    items: [
      {
        title: "Estándares antes que atajos",
        body: "Interfaces POSIX antes que extensiones de un fabricante.",
      },
      {
        title: "Una sola tarea, hecha de forma predecible",
        body: "Un init que solo gestiona procesos. Un gestor de servicios que solo gestiona servicios.",
      },
      {
        title: "Lo bastante pequeño para entenderlo entero",
        body: "Si no puedo explicar por qué una línea está ahí, no se queda.",
      },
    ],
  },
  contact: {
    title: "Contacto",
    heading: "Estoy disponible para trabajar.",
    body: "Mis proyectos son públicos en GitHub.",
  },
  footer: {
    source: "Código de este sitio",
    top: "Volver arriba",
  },
  quantum: {
    close: "Cerrar",
    branches: {
      open: "Ramas",
      title: "Ramas",
      description: "Cada lugar de esta página por el que pasaste, que se divide cada vez que tomaste otro camino. Elige uno para volver a él.",
      here: "Estás aquí",
      top: "Introducción",
      choice: {
        start: "Llegada",
        nav: "Enlace",
        lang: "Cambio de idioma",
        map: "Salto desde el mapa",
        link: "Visita directa",
        time: "Viaje en el tiempo",
      },
    },
    effects: {
      open: "Efectos",
      title: "Efectos",
      description: "Los efectos visuales de esta página. Tu elección se guarda en este navegador.",
      all: "Todos los efectos",
      reduced: "Tu sistema pide menos movimiento, así que los efectos se quedan quietos.",
      items: {
        ghosts: {
          name: "Vistas fantasma",
          note: "Ecos tenues de las partes de la página que aún no abriste.",
        },
        tunneling: {
          name: "Transiciones de efecto túnel",
          note: "Pasar a otra sección atraviesa una barrera.",
        },
        time: {
          name: "Viaje en el tiempo",
          note: "La línea de tiempo del encabezado, y esta página como podría haberse visto en el año de cada habilidad.",
        },
      },
    },
    time: {
      open: "Línea de tiempo",
      title: "Línea de tiempo",
      description: "Cada habilidad en el año en que apareció. Viaja a una para ver esta página como podría haberse visto entonces. El contenido sigue igual.",
      now: "Volver al presente",
      started: "vx empieza a usar tecnología",
      events: {
        1972: "C, en Bell Labs",
        1978: "El 8086 de Intel",
        1984: "El modelo OSI, publicado por ISO",
        1991: "Python 0.9.0 y la primera descripción de HTML",
        1995: "JavaScript, anunciado por Netscape",
        1996: "CSS nivel 1, recomendación del W3C",
        2004: "La primera versión pública de nginx",
        2009: "La primera versión de Node.js",
        2012: "La primera versión pública de TypeScript",
        2014: "nftables, incorporado a Linux 3.13",
        2016: "La primera versión de Next.js",
        2017: "El artículo del Transformer, “Attention Is All You Need”",
        2022: "El lanzamiento de ChatGPT",
      },
      worlds: {
        teletype: "Impresión de teletipo",
        terminal: "Terminal de video",
        desktop: "Escritorio",
        web1: "Web temprana",
        web2: "Web 2.0",
        flat: "Diseño plano",
        now: "Hoy",
      },
    },
  },
  notFound: {
    title: "Página no encontrada",
    body: "No hay ninguna página en esta dirección. El enlace puede estar desactualizado o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
