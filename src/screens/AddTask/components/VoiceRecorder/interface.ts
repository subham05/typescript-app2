export interface VoiceInterfaceProps {
  onDone: (
    result: string | undefined,
    meteringData: number[],
    recordTime: number,
  ) => void;
  startStopRecording?: (value: boolean) => void;
  onSave?: () => void;
  isStartRecording?: boolean;
  isLoading?: boolean;
  titleError?: boolean;
  chatScreen?: boolean;
}
