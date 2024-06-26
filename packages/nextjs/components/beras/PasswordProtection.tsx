"use client";

import { useEffect, useState } from "react";

const PASS = "AnEvenBetterEntry69420";

export const PasswordProtection = ({ children }: { children: React.ReactNode }) => {
  const [pw, setPw] = useState<string>("");
  const [err, setErr] = useState<boolean>();

  useEffect(() => {
    setPw(localStorage.getItem("goodentryPass") || "");
  }, []);

  if (pw == PASS) return <>{children}</>;
  else
    return (
      <div className="flex flex-row justify-center mt-8">
        <div className="p-4 w-64  bg-base-300">
          <p>Enter a Good password!</p>
          {err ? <span>Nope.</span> : <></>}
          <input
            type="password"
            className="w-full"
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (((e.target as HTMLInputElement).value as string) == PASS) {
                  localStorage.setItem("goodentryPass", PASS);
                  setPw(PASS);
                } else {
                  (e.target as HTMLInputElement).value = ""; // Clear input after sending
                  setErr(true);
                }
              } else setErr(false);
            }}
          />
        </div>
      </div>
    );
};
