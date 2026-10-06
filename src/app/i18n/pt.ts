import type { Dictionary } from "./en";

// Portuguese (Brazil). "Você" throughout, and wording that doesn't assign
// vx a grammatical gender ("Engenharia de software", not "Engenheiro").
// Quotes from English READMEs stay in English.
const pt: Dictionary = {
  meta: {
    title: "vx — engenharia de software",
    description: "vx mora no Uruguai e escreve C para Linux e TypeScript para a web.",
  },
  skip: "Pular para o conteúdo",
  nav: {
    label: "Seções",
    language: "Idioma",
    skills: "Habilidades",
    principles: "Princípios",
    contact: "Contato",
  },
  hero: {
    status: "Disponível para trabalhar",
    line: "Sou vx e trabalho com engenharia de software no Uruguai.",
    lede: "Escrevo C para Linux, até o PID 1, e TypeScript para a web, como este site. Me interessa como as coisas funcionam por dentro, das camadas de rede aos modelos de linguagem.",
  },
  skills: {
    title: "Habilidades",
    groups: { languages: "Linguagens", web: "Web", networking: "Redes", ai: "IA" },
    names: { asm: "Assembly x86", llm: "Como funcionam os LLMs", ai: "Trabalhar com IA" },
    notes: { l23: "Enlace de dados, rede", l4: "Transporte", l67: "Apresentação, aplicação" },
  },
  principles: {
    title: "Princípios",
    quote: "Programas pequenos, cada um com uma só tarefa, que usam interfaces POSIX sempre que possível e são curtos o bastante para ler de uma vez só.",
    items: [
      {
        title: "Padrões em vez de atalhos",
        body: "Interfaces POSIX em vez de extensões de um fornecedor.",
      },
      {
        title: "Uma tarefa, feita de forma previsível",
        body: "Um init que só gerencia processos. Um gerenciador de serviços que só gerencia serviços.",
      },
      {
        title: "Pequeno o bastante para entender por inteiro",
        body: "Se eu não sei explicar por que uma linha está ali, ela sai.",
      },
    ],
  },
  contact: {
    title: "Contato",
    heading: "Estou disponível para trabalhar.",
    body: "Meus projetos são públicos no GitHub.",
  },
  footer: {
    source: "Código deste site",
    top: "Voltar ao topo",
  },
  quantum: {
    close: "Fechar",
    branches: {
      open: "Ramificações",
      title: "Ramificações",
      description: "Cada lugar desta página por onde você passou, que se divide sempre que você escolheu outro caminho. Escolha um para voltar a ele.",
      here: "Você está aqui",
      top: "Introdução",
      choice: {
        start: "Chegada",
        nav: "Link",
        lang: "Troca de idioma",
        map: "Salto pelo mapa",
        link: "Visita direta",
        time: "Viagem no tempo",
      },
    },
    effects: {
      open: "Efeitos",
      title: "Efeitos",
      description: "Os efeitos visuais desta página. Sua escolha fica salva neste navegador.",
      all: "Todos os efeitos",
      reduced: "Seu sistema pede menos movimento, então os efeitos ficam parados.",
      items: {
        ghosts: {
          name: "Prévias fantasma",
          note: "Ecos suaves das partes da página que você ainda não abriu.",
        },
        superposition: {
          name: "Navegação em superposição",
          note: "Cada link do cabeçalho fica em vários lugares suaves ao mesmo tempo e colapsa em um só quando o ponteiro se aproxima. Em uma tela sensível ao toque, o primeiro toque colapsa um link e o segundo o abre.",
        },
        interference: {
          name: "Fundo de interferência",
          note: "Ondas suaves de três fontes, claras onde se somam e escuras onde se anulam. Uma segue o ponteiro, e cada ramificação posiciona as outras.",
        },
        cursor: {
          name: "Cursor de probabilidade",
          note: "Em um computador com mouse, uma nuvem de onde o ponteiro poderia estar. Um clique a colapsa em um ponto.",
        },
        entanglement: {
          name: "Habilidades emaranhadas",
          note: "As habilidades formam pares, como C e Assembly x86. Aponte ou toque em uma e o par responde, girando ao contrário.",
        },
        orbital: {
          name: "Orbital",
          note: "Em telas largas, ao lado da introdução, um orbital do hidrogênio desenhado a partir da sua densidade de probabilidade. Cada ramificação mostra o seu: 2p ou um de dois 3d.",
        },
        tunneling: {
          name: "Transições por tunelamento",
          note: "Passar para outra seção atravessa uma barreira.",
        },
        time: {
          name: "Viagem no tempo",
          note: "A linha do tempo no cabeçalho, e esta página como poderia ter sido no ano de cada habilidade.",
        },
      },
    },
    time: {
      open: "Linha do tempo",
      title: "Linha do tempo",
      description: "Cada habilidade no ano em que surgiu. Viaje até uma para ver esta página como ela poderia ter sido naquela época. O conteúdo continua o mesmo.",
      now: "Voltar ao presente",
      started: "vx começa a usar tecnologia",
      events: {
        1972: "C, no Bell Labs",
        1978: "O 8086 da Intel",
        1984: "O modelo OSI, publicado pela ISO",
        1991: "Python 0.9.0 e a primeira descrição do HTML",
        1995: "JavaScript, anunciado pela Netscape",
        1996: "CSS nível 1, recomendação do W3C",
        2004: "A primeira versão pública do nginx",
        2009: "A primeira versão do Node.js",
        2012: "A primeira versão pública do TypeScript",
        2014: "nftables, incorporado ao Linux 3.13",
        2016: "A primeira versão do Next.js",
        2017: "O artigo do Transformer, “Attention Is All You Need”",
        2022: "O lançamento do ChatGPT",
      },
      worlds: {
        teletype: "Impressão de teletipo",
        terminal: "Terminal de vídeo",
        desktop: "Área de trabalho",
        web1: "Web inicial",
        web2: "Web 2.0",
        flat: "Design flat",
        now: "Hoje",
      },
    },
  },
  notFound: {
    title: "Página não encontrada",
    body: "Não há nenhuma página neste endereço. O link pode estar desatualizado ou a URL pode ter um erro de digitação.",
    back: "Voltar para o início",
  },
};

export default pt;
