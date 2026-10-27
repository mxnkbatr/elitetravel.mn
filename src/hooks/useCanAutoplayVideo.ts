"use client";

import { useEffect, useState } from "react";

/** Desktop-ish + no reduced motion + not Save-Data → allow background video */
export function useCanAutoplayVideo() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;

    const update = () => {
      setOk(mq.matches && !reduce.matches && !conn?.saveData);
    };

    update();
    mq.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return ok;
}
