export interface User {
  phone: string;
  countryCode: string;
  name?: string;
  avatar?: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  buttonSoundEnabled: boolean;
  autoCheck: boolean;
}