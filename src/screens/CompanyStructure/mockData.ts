// import {colors} from 'common/theme/colors';
import {HierarchyCardModal, SiblingsDataModal} from './types';
export const structureRootData: HierarchyCardModal = {
  id: 1,
  hidden: true,
  type: 'blank',
  children: [
    {
      name: 'Abhishek Sharma',
      designation: 'OWNER',
      id: 2,
      no_parent: true,
      type: 'cardImg',
      imgUrl: '',
      color: '#02005B',
      hidden: false,
      companyId: '637f067f6df6fee6da3afa5c',
    },
    {
      id: 3,
      no_parent: true,
      type: 'blank',
      hidden: true,
      children: [
        {
          name: 'Henry ford',
          designation: 'GM',
          id: 6,
          hidden: false,
          // no_parent: true,
          type: 'card',
          color: '#1371FF',
          children: [
            {
              id: 7,
              hidden: false,
              type: 'image',
              imgUrl:
                'https://images.pexels.com/photos/2235130/pexels-photo-2235130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              children: [
                {
                  name: 4,
                  designation: 'Manager',
                  id: 8,
                  hidden: false,
                  color: '#747688',
                  type: 'card',
                  children: [
                    {
                      name: 1,
                      designation: 'Employee',
                      id: 9,
                      hidden: false,
                      color: '#02005B',
                      type: 'card',
                    },
                  ],
                },
              ],
            },
          ],
          companyId: '637f067f6df6fee6da3afa5c',
        },
      ],
    },
    {
      name: 'Mary Gomes',
      designation: 'OWNER',
      id: 4,
      no_parent: true,
      type: 'cardImg',
      imgUrl: '',
      color: '#02005B',
      hidden: false,
      // companyId: '637f067f6df6fee6da3afa5c',
    },
    {
      name: 'Kiara',
      designation: 'OWNER',
      id: 5,
      no_parent: true,
      type: 'cardImg',
      imgUrl: '',
      color: '#02005B',
      hidden: false,
      // companyId: '637f067f6df6fee6da3afa5c',
    },
  ],
};
// export const structureRootData: HierarchyCardModal = {
//   id: 1,
//   hidden: true,
//   type: CardTypes.blank,
//   children: [
//     {
//       name: 'Robert Fox',
//       designation: 'OWNER',
//       id: 2,
//       no_parent: true,
//       type: CardTypes.cardImg,
//       imgUrl:
//         'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
//       color: colors.primary,
//       hidden: false,
//     },
//     {
//       id: 3,
//       no_parent: true,
//       type: CardTypes.blank,
//       hidden: true,
//       children: [
//         {
//           name: 'John Doe',
//           designation: 'GM',
//           id: 6,
//           hidden: false,
//           color: colors.blue_001,
//           type: CardTypes.card,
//           children: [
//             {
//               id: 11,
//               hidden: false,
//               type: CardTypes.image,
//               imgUrl:
//                 'https://images.pexels.com/photos/2235130/pexels-photo-2235130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//               children: [
//                 {
//                   name: '10',
//                   designation: 'Manager',
//                   id: 12,
//                   hidden: false,
//                   color: colors.primary_003,
//                   type: CardTypes.card,
//                   children: [
//                     {
//                       name: '90',
//                       designation: 'Employees',
//                       id: 13,
//                       hidden: false,
//                       color: colors.yellow,
//                       type: CardTypes.card,
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: 'Jenny Watson',
//           designation: 'GM',
//           id: 7,
//           hidden: false,
//           color: colors.blue_001,
//           type: CardTypes.card,
//         },
//         {
//           id: 14,
//           hidden: true,
//           type: CardTypes.blank,
//           no_parent: true,
//           children: [
//             {
//               id: 15,
//               hidden: false,
//               type: CardTypes.image,
//               imgUrl:
//                 'https://images.pexels.com/photos/11876845/pexels-photo-11876845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//               children: [
//                 {
//                   name: '5',
//                   designation: 'Manager',
//                   id: 16,
//                   hidden: false,
//                   color: colors.primary_003,
//                   type: CardTypes.card,
//                   children: [
//                     {
//                       name: '100',
//                       designation: 'Employees',
//                       id: 17,
//                       hidden: false,
//                       color: colors.yellow,
//                       type: CardTypes.card,
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: 'Kristen Wilson',
//           designation: 'GM',
//           id: 8,
//           hidden: false,
//           color: colors.blue_001,
//           type: CardTypes.card,
//         },
//         {
//           name: 'Jane Cooper',
//           designation: 'GM',
//           id: 9,
//           hidden: false,
//           color: colors.blue_001,
//           type: CardTypes.card,
//           children: [
//             {
//               id: 18,
//               hidden: false,
//               type: CardTypes.image,
//               imgUrl:
//                 'https://images.pexels.com/photos/39720/pexels-photo-39720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//               children: [
//                 {
//                   name: '1',
//                   designation: 'Manager',
//                   id: 20,
//                   hidden: false,
//                   color: colors.primary_003,
//                   type: CardTypes.card,
//                   children: [
//                     {
//                       name: '25',
//                       designation: 'Employees',
//                       id: 21,
//                       hidden: false,
//                       color: colors.yellow,
//                       type: CardTypes.card,
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: 19,
//               hidden: false,
//               type: CardTypes.image,
//               imgUrl:
//                 'https://images.pexels.com/photos/434346/pexels-photo-434346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//               children: [
//                 {
//                   name: '4',
//                   designation: 'Manager',
//                   id: 22,
//                   hidden: false,
//                   color: colors.primary_003,
//                   type: CardTypes.card,
//                   children: [
//                     {
//                       name: '40',
//                       designation: 'Employees',
//                       id: 23,
//                       hidden: false,
//                       color: colors.yellow,
//                       type: CardTypes.card,
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: 'Esther Howard',
//           designation: 'GM',
//           id: 10,
//           hidden: false,
//           color: colors.blue_001,
//           type: CardTypes.card,
//           children: [
//             {
//               id: 24,
//               hidden: false,
//               type: CardTypes.image,
//               imgUrl:
//                 'https://images.pexels.com/photos/2235130/pexels-photo-2235130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//               children: [
//                 {
//                   name: '10',
//                   designation: 'Manager',
//                   id: 25,
//                   hidden: false,
//                   color: colors.primary_003,
//                   type: CardTypes.card,
//                   children: [
//                     {
//                       name: '90',
//                       designation: 'Employees',
//                       id: 26,
//                       hidden: false,
//                       color: colors.yellow,
//                       type: CardTypes.card,
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: 'Leslie Alexander',
//       designation: 'OWNER',
//       id: 4,
//       no_parent: true,
//       type: CardTypes.cardImg,
//       imgUrl:
//         'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//       color: colors.primary,
//       hidden: false,
//     },
//     {
//       name: 'check Alexander',
//       designation: 'OWNER',
//       id: 5,
//       no_parent: true,
//       type: CardTypes.cardImg,
//       imgUrl:
//         'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//       color: colors.primary,
//       hidden: false,
//     },
//   ],
// };

export const siblingsData: SiblingsDataModal[] = [
  {
    source: {
      id: 2,
    },
    target: {
      id: 5,
    },
  },
];

// export const siblingsData: SiblingsDataModal[] = [
//   {
//     source: {
//       id: 2,
//     },
//     target: {
//       id: 5,
//     },
//   },
//   {
//     source: {
//       id: 7,
//     },
//     target: {
//       id: 8,
//     },
//   },
// ];

// export const siblingsData: SiblingsDataModal[] = [
//   {
//     source: {
//       id: 2,
//     },
//     target: {
//       id: 5,
//     },
//   },
// ];
