export interface VoiceNotesProps {
  onResult: (
    voicePath: string | undefined,
    waveformData: number[],
    timeMS: number,
  ) => void;
  recordingVoiceNote?: (value: boolean) => void;
  chatScreen?: boolean;
}
