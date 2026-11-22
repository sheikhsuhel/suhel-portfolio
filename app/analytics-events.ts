export const events = {
  home: "Portfolio views",
  caseStudy: "Case study views",
  engaged: "30 seconds of active viewing",
  question: "Assistant questions",
  download: "File downloads",
  verify: "Credential verifications",
  contact: "Contact clicks",
} as const;

export type EventName = keyof typeof events;
export function record(event: EventName) {
  if (navigator.doNotTrack === "1") return;
  void fetch("/api/activity", {method: "POST", body: event, keepalive: true}).catch(() => {});
}
