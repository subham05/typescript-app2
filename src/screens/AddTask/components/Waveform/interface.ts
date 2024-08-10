export interface WaveFormProps {
  bufferData: number[];
  timeMS: number;
  waveFormUri?: string;
  hideIcon?: boolean;
  isAudioPlay?: boolean;
  id?: string;
  selectedNote?: string | null;
  setAudioPlay?: (value: null | string) => void;
  reducedLength?: number;
}
