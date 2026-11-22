"use client";

import { useEffect, useState } from "react";
import { modelAvailability, prepareModel } from "./content/assistant";

export function ModelControl() {
  const [status, setStatus] = useState("checking");
  const [progress, setProgress] = useState(0);
  useEffect(() => { void modelAvailability().then(setStatus).catch(() => setStatus("unavailable")); }, []);
  async function enable() {
    setStatus("preparing");
    try { await prepareModel(setProgress); setStatus("available"); }
    catch { setStatus("retry"); }
  }
  if (status === "downloadable" || status === "downloading" || status === "retry") {
    return <div><p>Your browser can download a local language model to summarize sources. This uses device storage and data.</p>
      <button type="button" className="button button-secondary" onClick={enable}>{status === "retry" ? "Retry model download" : "Enable on-device AI"}</button></div>;
  }
  if (status === "preparing") return <p role="status">Preparing the on-device model · {progress}%</p>;
  if (status === "available") return <p>On-device AI is ready.</p>;
  return null;
}
