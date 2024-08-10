import {colors} from 'common/theme/colors';
import {CardTypes, HierarchyCardModal, SiblingsDataModal} from './types';

export const structureRootData: HierarchyCardModal = {
  id: 1,
  hidden: true,
  type: CardTypes.blank,
  children: [
    {
      name: 'Robert Fox',
      designation: 'Founder',
      id: 2,
      no_parent: true,
      type: CardTypes.cardImg,
      imgUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      color: colors.primary,
      hidden: false,
    },
    {
      id: 3,
      no_parent: true,
      type: CardTypes.blank,
      hidden: true,
      children: [
        {
          name: 'John Doe',
          designation: 'GM',
          id: 5,
          hidden: false,
          color: colors.blue_001,
          type: CardTypes.card,
          children: [
            {
              name: '10',
              designation: 'Manager',
              id: 11,
              hidden: false,
              color: colors.primary_003,
              type: CardTypes.card,
              children: [
                {
                  name: '90',
                  designation: 'Employees',
                  id: 12,
                  hidden: false,
                  color: colors.yellow,
                  type: CardTypes.card,
                },
              ],
            },
          ],
        },
        {
          name: 'Jenny Watson',
          designation: 'GM',
          id: 6,
          hidden: false,
          color: colors.blue_001,
          type: CardTypes.card,
        },
        {
          id: 13,
          hidden: true,
          type: CardTypes.blank,
          no_parent: true,
          children: [
            {
              name: '5',
              designation: 'Manager',
              id: 15,
              hidden: false,
              color: colors.primary_003,
              type: CardTypes.card,
              children: [
                {
                  name: '100',
                  designation: 'Employees',
                  id: 16,
                  hidden: false,
                  color: colors.yellow,
                  type: CardTypes.card,
                },
              ],
            },
          ],
        },
        {
          name: 'Kristen Wilson',
          designation: 'GM',
          id: 7,
          hidden: false,
          color: colors.blue_001,
          type: CardTypes.card,
        },
        {
          name: 'Jane Cooper',
          designation: 'GM',
          id: 8,
          hidden: false,
          color: colors.blue_001,
          type: CardTypes.card,
          children: [
            {
              name: '1',
              designation: 'Manager',
              id: 19,
              hidden: false,
              color: colors.primary_003,
              type: CardTypes.card,
              children: [
                {
                  name: '25',
                  designation: 'Employees',
                  id: 20,
                  hidden: false,
                  color: colors.yellow,
                  type: CardTypes.card,
                },
              ],
            },
            {
              name: '4',
              designation: 'Manager',
              id: 21,
              hidden: false,
              color: colors.primary_003,
              type: CardTypes.card,
              children: [
                {
                  name: '40',
                  designation: 'Employees',
                  id: 22,
                  hidden: false,
                  color: colors.yellow,
                  type: CardTypes.card,
                },
              ],
            },
          ],
        },
        {
          name: 'Esther Howard',
          designation: 'GM',
          id: 9,
          hidden: false,
          color: colors.blue_001,
          type: CardTypes.card,
          children: [
            {
              name: '10',
              designation: 'Manager',
              id: 24,
              hidden: false,
              color: colors.primary_003,
              type: CardTypes.card,
              children: [
                {
                  name: '90',
                  designation: 'Employees',
                  id: 25,
                  hidden: false,
                  color: colors.yellow,
                  type: CardTypes.card,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Leslie Alexander',
      designation: 'CEO',
      id: 4,
      no_parent: true,
      type: CardTypes.cardImg,
      imgUrl:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: colors.primary,
      hidden: false,
    },
  ],
};

export const siblingsData: SiblingsDataModal[] = [
  {
    source: {
      id: 2,
    },
    target: {
      id: 4,
    },
  },
  {
    source: {
      id: 6,
    },
    target: {
      id: 7,
    },
  },
];
