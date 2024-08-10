export interface HierarchyCardModal {
  name?: string;
  designation?: string;
  id: number;
  type?: string;
  imgUrl?: string;
  color?: string;
  hidden: boolean;
  no_parent?: boolean;
  children?: HierarchyCardModal[];
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
