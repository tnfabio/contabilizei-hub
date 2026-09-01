export type WidgetSize = "1x1" | "2x1" | "2x2";

export type WidgetType = "profile" | "social" | "showcase" | "newsletter" | "map" | "link";

export type Widget = {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  content: Record<string, unknown>;
};

export const sizeClasses: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1 aspect-square sm:aspect-auto sm:row-span-1",
  "2x1": "col-span-1 sm:col-span-2 row-span-1",
  "2x2": "col-span-1 sm:col-span-2 row-span-2",
};

export const initialWidgets: Widget[] = [
  {
    id: "w-profile",
    type: "profile",
    size: "2x2",
    content: {
      full_name: "Rafael Andrade",
      username: "rafael.contador",
      bio: "Contador digital ajudando founders a abrirem CNPJ, pagarem menos imposto e dormirem tranquilos.",
      tags: ["Contabilidade", "MEI & Simples", "Financeiro SaaS", "Bubble", "React"],
    },
  },
  { id: "w-linkedin", type: "social", size: "1x1", content: { network: "linkedin", url: "https://linkedin.com" } },
  { id: "w-instagram", type: "social", size: "1x1", content: { network: "instagram", url: "https://instagram.com" } },
  {
    id: "w-showcase",
    type: "showcase",
    size: "2x1",
    content: {
      title: "Guia: abrindo seu CNPJ em 7 dias",
      subtitle: "Aula gratuita",
      url: "https://youtube.com",
    },
  },
  { id: "w-github", type: "social", size: "1x1", content: { network: "github", url: "https://github.com" } },
  { id: "w-youtube", type: "social", size: "1x1", content: { network: "youtube", url: "https://youtube.com" } },
  {
    id: "w-newsletter",
    type: "newsletter",
    size: "2x1",
    content: {
      title: "Boletim do Contador",
      subtitle: "Impostos, prazos e dicas toda sexta.",
    },
  },
  { id: "w-map", type: "map", size: "1x1", content: { city: "São Paulo, BR" } },
  {
    id: "w-link",
    type: "link",
    size: "1x1",
    content: { label: "Agendar consultoria", url: "https://cal.com" },
  },
];
