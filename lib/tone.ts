import type {
  CheckStatus,
  EngineReadinessStatus,
  ReadinessBand,
} from "./readiness-types";

// One place that maps every status/band to the Zene status palette, so the ring,
// pills, dimension bars and engine rows never disagree on color.

export type Tone = "ok" | "watch" | "bad" | "muted";

export function bandTone(band: ReadinessBand): Tone {
  switch (band) {
    case "excellent":
    case "good":
      return "ok";
    case "needs-work":
      return "watch";
    case "at-risk":
      return "bad";
  }
}

export function statusTone(status: CheckStatus): Tone {
  return status === "pass" ? "ok" : status === "warn" ? "watch" : "bad";
}

export function engineTone(status: EngineReadinessStatus): Tone {
  switch (status) {
    case "ok":
      return "ok";
    case "warn":
      return "watch";
    case "blocked":
      return "bad";
    case "unchecked":
      return "muted";
  }
}

export function scoreTone(score: number): Tone {
  return score >= 65 ? "ok" : score >= 40 ? "watch" : "bad";
}
