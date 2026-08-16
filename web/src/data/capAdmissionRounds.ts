export interface CapAdmissionRound {
  round: string;
  activity: "Not Allotted" | "Allotted";
  streamCode: string;
  collegeName: string;
  status: string;
}

export const CAP_ADMISSION_ROUNDS: CapAdmissionRound[] = [
  { round: "Zero Round", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Regular Round-1", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Regular Round-2", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Regular Round-3", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Special Round-1", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Special Round-2", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Special Round-3", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Special Round-4", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
  { round: "Special Round-5", activity: "Not Allotted", streamCode: "--", collegeName: "--", status: "--" },
];
