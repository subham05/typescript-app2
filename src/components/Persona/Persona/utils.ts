import initials from 'initials';

export const getInitials = (name: string) => {
  let abbr = initials(name)?.toString();
  if (name?.startsWith('+')) {
    abbr = `+${abbr}`;
  }
  if (!abbr) {
    // console.warn('Could not get abbr from name');
    abbr = '';
  }
  return abbr?.slice(0, 2)?.toUpperCase();
};
