import type { Dictionary } from "./en";

// Portuguese (Brazil). "Você" throughout, and wording that doesn't assign
// vx a grammatical gender ("Engenharia de sistemas", not "Engenheiro").
// Quotes from English READMEs stay in English.
const pt: Dictionary = {
  meta: {
    title: "vx — engenharia de sistemas",
    description:
      "vx escreve sistemas init mínimos e ferramentas de boot em C, pequenos o bastante para ler de uma vez só.",
  },
  skip: "Pular para o conteúdo",
  nav: {
    label: "Seções",
    language: "Idioma",
    work: "Trabalho",
    principles: "Princípios",
    stack: "Ferramentas",
    contact: "Contato",
  },
  hero: {
    line: "Sistemas init e ferramentas de boot em C.",
    lede: "Programas pequenos, cada um com uma só tarefa, que usam interfaces POSIX sempre que possível e são curtos o bastante para ler de uma vez só.",
    facts: [
      { k: "Função", v: "Engenharia de sistemas" },
      { k: "Foco", v: "Sistemas init, C POSIX" },
      { k: "Agora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  work: {
    title: "Trabalho",
    status: {
      shipping: "disponível",
      "in progress": "em andamento",
      planned: "planejado",
    },
    spec: {
      language: "Linguagem",
      target: "Plataforma",
      build: "Build",
      license: "Licença",
      framework: "Framework",
      styling: "Estilos",
      hosting: "Hospedagem",
    },
    suite: {
      body: "Uma pilha de boot autocontida em C: init, rc, logger e user.",
      target: "Linux",
      components: "Componentes",
      nodes: {
        "4init": "PID 1 mínimo. Bloqueia os sinais e os lê por um signalfd, faz fork do 4rc em uma sessão própria e recolhe os processos filhos a cada SIGCHLD. Inspirado no init mínimo do rofl0r.",
        "4rc": "O gerenciador de serviços que o 4init inicia por padrão. Ainda está no começo.",
      },
    },
    site: {
      body: "Um site estático exportado com Next.js e servido pelo Cloudflare Workers, em inglês, espanhol e português. Um Worker no endereço raiz escolhe o seu idioma, e a página segue o modo claro ou escuro do seu sistema.",
    },
  },
  principles: {
    title: "Princípios",
    items: [
      {
        title: "Padrões em vez de atalhos",
        body: "Interfaces POSIX em vez de extensões de um fornecedor.",
      },
      {
        title: "Uma tarefa, feita de forma previsível",
        body: "Um init que só gerencia processos e um gerenciador de serviços que só gerencia serviços. O resto da pilha está planejado como programas à parte.",
      },
      {
        title: "Pequeno o bastante para entender por inteiro",
        body: "Se eu não sei explicar por que uma linha está ali, ela sai.",
      },
    ],
  },
  stack: {
    title: "Ferramentas",
    groups: { languages: "Linguagens", web: "Web", tooling: "Utilitários" },
  },
  contact: {
    title: "Contato",
    line: "Todo o trabalho acima é público no GitHub.",
  },
  footer: {
    source: "Código deste site",
    top: "Voltar ao topo",
  },
  notFound: {
    title: "Página não encontrada",
    body: "Não há nenhuma página neste endereço. O link pode estar desatualizado ou a URL pode ter um erro de digitação.",
    back: "Voltar para o início",
  },
};

export default pt;
