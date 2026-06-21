"use client";
import { useEffect, useState } from "react";

export default function TypedLine({ role }) {
  const lines = [`> ${role}`, "> React · Node · Express · MongoDB", "> open to work"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 2200);
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div className="typed-line">
      {lines[index]}
      <span className="caret"></span>
    </div>
  );
}
