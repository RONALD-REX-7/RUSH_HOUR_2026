export type ProblemStatus = "SUBMITTED" | "VERIFIED" | "SOLVED" | "ARCHIVED";

export function canTransitionStatus(current: ProblemStatus, next: ProblemStatus): boolean {
  const transitions: Record<ProblemStatus, ProblemStatus[]> = {
    SUBMITTED: ["VERIFIED", "ARCHIVED"],
    VERIFIED: ["SOLVED", "ARCHIVED"],
    SOLVED: ["ARCHIVED"],
    ARCHIVED: []
  };
  return transitions[current]?.includes(next) ?? false;
}
