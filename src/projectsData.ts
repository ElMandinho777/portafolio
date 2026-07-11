import { Project, CaptainLog } from "./types";

const githubProfile = "https://github.com/ElMandinho777";

export const projectsData: Project[] = [
  {
    id: "p1",
    name: "Rinconcito-01",
    title: "El Rinconcito",
    tagline: "Plataforma Full Stack para la gestión digital de un negocio de comida",
    description: "Aplicación web moderna para un local de comida, creada para ofrecer una experiencia atractiva a clientes y administradores. Permite explorar el menú de forma dinámica y mantener actualizados los productos, categorías y datos del establecimiento desde un panel administrativo.",
    technologies: ["React", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MySQL", "Firebase"],
    features: [
      "Menú dinámico organizado por categorías.",
      "Panel administrativo para gestionar el contenido del negocio.",
      "Operaciones CRUD de productos y categorías.",
      "Diseño responsivo y optimizado para dispositivos móviles.",
      "Arquitectura Full Stack con API, base de datos y servicios de Firebase."
    ],
    stats: {
      distance: "Proyecto comercial",
      class: "Aplicación Full Stack",
      moons: 4,
      status: "Active"
    },
    links: { github: githubProfile },
    colorClass: "amber",
    glowColor: "glow-amber",
    size: 52,
    orbitRadius: 155,
    orbitSpeed: 28,
    angleOffset: 0
  },
  {
    id: "p2",
    name: "Serenity",
    title: "Serenity Space",
    tagline: "Experiencia web para promover la relajación, el bienestar y la concentración",
    description: "Aplicación frontend enfocada en ayudar a reducir el estrés y mejorar la concentración. Fue desarrollada con una estética minimalista, navegación fluida, animaciones suaves y herramientas sencillas para crear una experiencia digital relajante.",
    technologies: ["React", "Vite", "TypeScript", "Tailwind CSS"],
    features: [
      "Temporizador de meditación.",
      "Biblioteca de sonidos relajantes.",
      "Técnicas de respiración guiada.",
      "Interfaz minimalista, responsiva y centrada en el bienestar.",
      "Animaciones suaves para mantener una experiencia tranquila."
    ],
    stats: {
      distance: "Proyecto de bienestar",
      class: "Aplicación Frontend",
      moons: 3,
      status: "Active"
    },
    links: {
      github: githubProfile,
      live: "http://2.25.174.243/equipo_08/"
    },
    colorClass: "purple",
    glowColor: "glow-purple",
    size: 58,
    orbitRadius: 250,
    orbitSpeed: 44,
    angleOffset: 2.1
  },
  {
    id: "p3",
    name: "GasLeak",
    title: "GasLeak — Sistema IoT",
    tagline: "Detección de fugas de gas y ventilación automática en tiempo real",
    description: "Sistema IoT para detectar fugas de gas y ejecutar acciones automáticas que reduzcan riesgos en el hogar. Una Raspberry Pi monitorea continuamente gas y temperatura; ante niveles peligrosos activa ventilación, alertas y mecanismos físicos de seguridad.",
    technologies: ["Python", "Raspberry Pi 3B+", "MQ-2", "DHT11", "MCP3008", "Servo SG90", "Relé", "GPIO", "IoT"],
    features: [
      "Detección de fugas mediante sensor MQ-2.",
      "Monitoreo de temperatura con sensor DHT11.",
      "Apertura automática de una ventana mediante servomotor.",
      "Activación de extractor, LEDs de alerta y alarma sonora.",
      "Automatización del proceso de ventilación con Raspberry Pi."
    ],
    stats: {
      distance: "Prototipo físico",
      class: "Sistema IoT",
      moons: 6,
      status: "Active"
    },
    links: { github: githubProfile },
    colorClass: "cyan",
    glowColor: "glow-cyan",
    size: 48,
    orbitRadius: 350,
    orbitSpeed: 62,
    angleOffset: 4.2
  }
];

export const captainLogs: CaptainLog[] = [
  {
    id: "log1",
    stardate: "ACTUAL",
    mission: "Desarrollador Web Freelance",
    summary: "Creación de soluciones web modernas para pequeños negocios.",
    details: "Desarrollo aplicaciones responsivas, interfaces intuitivas y paneles administrativos. Integro APIs REST, gestiono bases de datos y optimizo el rendimiento de cada solución de acuerdo con las necesidades del cliente."
  },
  {
    id: "log2",
    stardate: "GRADUADO",
    mission: "TSU en Tecnologías de la Información",
    summary: "Área Desarrollo de Software Multiplataforma — Universidad Tecnológica.",
    details: "Formación profesional en análisis, desarrollo e implementación de soluciones de software para distintas plataformas, con bases en programación, bases de datos y desarrollo de aplicaciones."
  },
  {
    id: "log3",
    stardate: "CERTIFICADO",
    mission: "Soporte de Tecnologías de la Información de Google",
    summary: "Google Career Certificate orientado a soporte y administración de TI.",
    details: "Formación en soporte técnico, sistemas operativos, redes, administración de sistemas, seguridad informática y resolución estructurada de problemas tecnológicos."
  }
];
