import {CreateApi} from 'request/CreateApi';

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  hierarchyData: HierarchyData;
  sibilingData: SiblingData[];
}

export interface HierarchyData {
  id: number;
  hidden: boolean;
  type: string;
  children: Children[];
}

export interface Children {
  name?: string;
  designation?: string;
  id: number;
  no_parent: boolean;
  type: string;
  imgUrl?: string;
  color?: string;
  hidden: boolean;
  companyId?: string;
  children?: Children[];
}

// export interface Children2 {
//   name: string;
//   designation: string;
//   id: number;
//   hidden: boolean;
//   type: string;
//   color: string;
//   children: Children3[];
//   companyId: string;
// }

// export interface Children3 {
//   id: number;
//   hidden: boolean;
//   type: string;
//   imgUrl: string;
//   children: Children4[];
// }

// export interface Children4 {
//   name: number;
//   designation: string;
//   id: number;
//   hidden: boolean;
//   color: string;
//   type: string;
//   children: Children5[];
// }

// export interface Children5 {
//   name: number;
//   designation: string;
//   id: number;
//   hidden: boolean;
//   color: string;
//   type: string;
// }

export interface SiblingData {
  source: Source;
  target: Target;
}

export interface Source {
  id: number;
}

export interface Target {
  id: number;
}

const CompanyStructureCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    companyStructure: builder.mutation<Root, void>({
      query: () => ({
        url: '/company/structure',
        method: 'GET',
      }),
    }),
  }),
});

export const {useCompanyStructureMutation} = CompanyStructureCollection;
