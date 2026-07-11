export interface Project {
  id: string;
  name: string;      // Nombre espacial del proyecto
  title: string;     // Technical project title
  tagline: string;   // Short description
  description: string; // Long description
  technologies: string[];
  features: string[];
  stats: {
    distance: string;   // Aesthetic space stat (e.g., "4.2 años luz")
    class: string;      // Planet type (e.g., "Gaseoso, Gigante", "Super-Tierra rocosa")
    moons: number;      // Number of moons (e.g. project modules)
    status: "Active" | "Developing" | "Archived";
  };
  links: {
    github?: string;
    live?: string;
  };
  colorClass: string;   // Tailwind color class prefix (e.g. "cyan", "purple", "emerald")
  glowColor: string;    // CSS shadow utility (e.g., "glow-cyan")
  size: number;         // visual diameter in pixels
  orbitRadius: number;  // orbit distance from sun in pixels
  orbitSpeed: number;   // rotation duration (seconds)
  angleOffset: number;  // initial position (radians or degrees)
}

export interface CaptainLog {
  id: string;
  stardate: string;
  mission: string;
  summary: string;
  details: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  stardate: string;
}
