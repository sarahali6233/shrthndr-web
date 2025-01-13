export interface TestData {
  timestamp: string;
  jobCategory: string;
  shorthandTest: TestDetails | null;
  normalTest: TestDetails | null;
  timeSaved: TimeSavedDetails | null;
}

export interface TestDetails {
  wpm: number;
  accuracy: number;
  timeInSeconds: number;
  inputText: string;
}

export interface TimeSavedDetails {
  seconds: number;
  percentage: number;
}
