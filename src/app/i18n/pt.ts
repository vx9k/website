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
    principles: "Princípios",
    work: "Trabalho",
    stack: "Ferramentas",
    contact: "Contato",
  },
  display: {
    button: "Tela",
    label: "Configurações de tela",
    systemOn: "ligado: seu sistema pede isso",
    note: "Fica salvo neste dispositivo. As configurações do seu sistema para contraste, movimento e telas de tinta eletrônica são seguidas automaticamente.",
    contrast: { label: "Alto contraste", hint: "Cores sólidas, bordas mais fortes" },
    motion: { label: "Reduzir movimento", hint: "Desliga as animações" },
    eink: { label: "Papel (tinta eletrônica)", hint: "Preto no branco, para telas de tinta eletrônica" },
    large: { label: "Texto maior", hint: "Letras 25% maiores" },
  },
  offline: {
    down: "Você está offline. As páginas que você já abriu continuam funcionando.",
    back: "Conexão restabelecida.",
  },
  hero: {
    lead: "Escrevo software feito para",
    phrases: [
      "durar mais que a máquina onde roda.",
      "caber na cabeça de quem lê.",
      "fazer uma coisa só, de forma previsível.",
    ],
    lede: "Escrevo sistemas init mínimos em C. O código é pequeno o bastante para ler de uma vez só e segue as interfaces POSIX sempre que possível.",
    cta: "Ver o trabalho",
    facts: [
      { k: "Função", v: "Engenharia de sistemas" },
      { k: "Foco", v: "Sistemas init, C POSIX" },
      { k: "Agora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  principles: {
    kicker: "Princípios",
    title: "Como eu construo",
    aside: "Três regras que resolvem quase todas as minhas escolhas de projeto antes de eu escrever uma linha.",
    items: [
      {
        title: "Padrões em vez de atalhos",
        body: "Interfaces POSIX em vez de extensões de um fornecedor. Se um programa roda em uma só plataforma, alguém decidiu isso, e a decisão precisa de um motivo.",
      },
      {
        title: "Uma tarefa, feita de forma previsível",
        body: "Um init que só gerencia processos. Um gerenciador de serviços que só gerencia serviços. Quando o escopo cresce sem controle, costuma ser o primeiro sinal de que algo vai deixar de ser confiável.",
      },
      {
        title: "Pequeno o bastante para entender por inteiro",
        body: "Código que cabe na sua cabeça é melhor que código em que você precisa confiar. Se eu não sei explicar por que uma linha está ali, ela sai.",
      },
    ],
  },
  work: {
    kicker: "Trabalho",
    title: "Projetos",
    aside: "Programas pequenos, cada um com uma só tarefa, organizados na ordem em que rodam.",
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
      graphics: "Gráficos",
      hosting: "Hospedagem",
    },
    suite: {
      eyebrow: "Pilha de boot",
      body: "Uma pilha de boot independente em C: init, rc, logger e user, cada um com escopo próprio e README próprio.",
      target: "Linux, BSD planejado",
      components: "Componentes",
      componentsLabel: "Componentes do 4suite",
      nodes: {
        "4init": {
          body: "PID 1 mínimo. Bloqueia os sinais e os lê por um signalfd, faz fork do 4rc em uma sessão própria e recolhe os processos filhos a cada SIGCHLD. O caminho do rc fica em config.h. Se ele falhar, o kernel entra em pânico, como aconteceria com qualquer init.",
          note: "Inspirado no init mínimo do rofl0r.",
        },
        "4rc": {
          body: "O gerenciador de serviços que o 4init inicia. Ainda está no começo: o próprio README diz que ele “larps as being functional”.",
        },
        logger: { body: "Faz parte do escopo da suíte. Ainda não começou." },
        user: { body: "Faz parte do escopo da suíte. Ainda não começou." },
      },
      platforms:
        "Por enquanto, só Linux. signalfd é uma interface do Linux; o suporte a BSD está planejado.",
    },
    site: {
      eyebrow: "Este site",
      body: "Um export estático de Next.js servido pelo Cloudflare Workers. As montanhas no topo da página são pixel art: geradas no build do site e entregues como um único SVG, sem scripts. A página avisa quando você fica offline, tem um modo papel para telas de tinta eletrônica e está em inglês, espanhol e português.",
    },
  },
  stack: {
    kicker: "Ferramentas",
    title: "Com o que eu trabalho",
    groups: { languages: "Linguagens", web: "Web", tooling: "Utilitários" },
  },
  contact: {
    kicker: "Contato",
    title: "Fale comigo",
    quote:
      "Prefiro lançar algo pequeno que eu entendo por completo do que algo grande cujos limites ainda estou descobrindo.",
    source: "Código deste site",
  },
  footer: { source: "Código" },
  notFound: {
    title: "Página não encontrada",
    eyebrow: "Não encontrada",
    body: "Não há nada neste endereço. O link pode estar desatualizado ou a URL pode ter um erro de digitação.",
    back: "Voltar para o início",
  },
};

export default pt;
