export interface HierarchyCardModal {
  name?: string | number;
  designation?: string;
  id: number;
  type?: string;
  imgUrl?: string;
  color?: string;
  hidden: boolean;
  no_parent?: boolean;
  children?: HierarchyCardModal[];
  companyId?: string;
  depth?: number;
  x?: number;
  y?: number;
}

export interface SiblingsDataModal {
  source: NodeData;
  target: NodeData;
}

interface NodeData {
  id: number;
  // name: string;
}

export enum CardTypes {
  cardImg = 'cardImg',
  card = 'card',
  image = 'image',
  blank = 'blank',
}
