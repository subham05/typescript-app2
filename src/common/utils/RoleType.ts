export const roleType = (role: string) => {
  switch (role) {
    case 'OWNER':
    case 'MANAGER':
    case 'EMPLOYEE':
      const lowerCaseStr = role.toLowerCase();
      const str = lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
      return str;
    case 'PA':
      return 'Personal Assistant';
    case 'GM':
      return 'General Manager';
    default:
      break;
  }
};
