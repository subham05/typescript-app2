export interface SignInProps {
  email: string;
  password: string;
}

export enum consentStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}
