export interface ChangePassProps {
  oldPass: string;
  newPass: string;
  confirmPass: string;
}

export interface RenderRightProps {
  showPass: boolean;
  setShowPass: (val: boolean) => void;
}
