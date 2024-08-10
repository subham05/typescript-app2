import {ContactModal} from 'screens/Contacts';

export const getTitle = (
  sortType: string,
  index: number,
  item: ContactModal,
) => {
  switch (sortType) {
    case 'COMPANY':
      return item.companyName || 'Others';
    case 'INDUSTRY':
      return item.contactIndustry || 'Others';
    case 'DEPARTMENT':
      return item.contactDepartment || 'Others';
    case 'SECTOR':
      return item.contactSector || 'Others';
    case 'FIELD':
      return item.contactField || 'Others';
  }
};

export const showTitle = (
  sortType: string,
  index: number,
  item: ContactModal,
  sortedArray: ContactModal[] | undefined,
) => {
  switch (sortType) {
    case 'COMPANY':
      return (
        index === 0 || item.companyName !== sortedArray![index - 1].companyName
      );
    case 'INDUSTRY':
      return (
        index === 0 ||
        item.contactIndustry !== sortedArray![index - 1].contactIndustry
      );
    case 'DEPARTMENT':
      return (
        index === 0 ||
        item.contactDepartment !== sortedArray![index - 1].contactDepartment
      );
    case 'SECTOR':
      return (
        index === 0 ||
        item.contactSector !== sortedArray![index - 1].contactSector
      );
    case 'FIELD':
      return (
        index === 0 ||
        item.contactField !== sortedArray![index - 1].contactField
      );
  }
};
