export type WidgetSize = "1x1" | "2x1" | "2x2";

export type WidgetTipo = "link" | "imagem" | "texto" | "mapa" | "video";

export type LinkConteudo = { url: string; rotulo: string };
export type ImagemConteudo = { url: string; rotulo?: string };
export type TextoConteudo = { texto: string; tipo_copia: boolean };
export type MapaConteudo = { lat: number; lng: number; endereco: string };
export type VideoConteudo = { url: string; rotulo?: string };

export type WidgetConteudo =
  LinkConteudo | ImagemConteudo | TextoConteudo | MapaConteudo | VideoConteudo;

export type Bloco = {
  id: number;
  perfil_id: number;
  tipo: WidgetTipo;
  titulo?: string;
  conteudo: WidgetConteudo;
  colunas: number;
  linhas: number;
  ordem: number;
  visivel: boolean;
  created_at: string;
};

export type Perfil = {
  id: number;
  usuario_id: string;
  slug: string;
  nome_completo: string;
  bio: string;
  avatar_url: string | null;
  configuracao_tema?: Record<string, unknown> | null;
  created_at: string;
};

export type Widget = {
  id: number;
  tipo: WidgetTipo;
  titulo?: string;
  conteudo: WidgetConteudo;
  colunas: number;
  linhas: number;
  ordem: number;
};

export const sizeClasses: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1 aspect-square sm:aspect-auto sm:row-span-1",
  "2x1": "col-span-1 sm:col-span-2 row-span-1",
  "2x2": "col-span-1 sm:col-span-2 row-span-2",
};

export function widgetSizeFromColsLinhas(colunas: number, linhas: number): WidgetSize {
  if (colunas >= 2 && linhas >= 2) return "2x2";
  if (colunas >= 2 || linhas >= 2) return "2x1";
  return "1x1";
}

export const initialWidgets: Widget[] = [];
