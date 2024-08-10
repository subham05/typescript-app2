export interface ProgressTypeModal {
  type: string;
  detailType:
    | 'EmergencyDetails'
    | 'HighDetails'
    | 'MediumDetails'
    | 'LowDetails';
}

export const progressType: ProgressTypeModal[] = [
  {type: 'emergency', detailType: 'EmergencyDetails'},
  {type: 'high', detailType: 'HighDetails'},
  {type: 'medium', detailType: 'MediumDetails'},
  {type: 'low', detailType: 'LowDetails'},
];

export enum ZoneType {
  RED = 'RED',
}

export interface GraphDataModal {
  x: number;
  y: string | number | undefined;
}

export const generateGraphDataModal = (obj: {
  [key: string]: string | number | undefined;
}) => {
  const graphData = [
    {x: 1, y: obj?.completed},
    {x: 2, y: obj?.inProgress},
    {x: 3, y: obj?.reopened},
    {x: 4, y: obj?.overDue},
    {x: 5, y: obj?.resolved},
    {x: 6, y: obj?.beforeTime},
    {x: 7, y: obj?.afterTime},
  ];
  return graphData;
};

export const firstLetterCapital = (text: string) =>
  text!.charAt(0).toUpperCase() + text!.slice(1).toLowerCase();
