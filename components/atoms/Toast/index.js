import React, { useEffect } from "react";

export function Toast() {
  useEffect(() => {
    ScrollReveal().reveal("#toast", {
      delay: 1000,
      distance: "-350%",
      origin: "bottom",
      reset: true,
    });
  }, []);

  return (
    <div>
      <div className="w-full flex justify-center">
        <a
          href="mailto:farisaziz12@gmail.com?subject=Faris, you're hired!"
          id="toast"
          className="load-hidden absolute text-center bg-white text-black font-bold tracking-wider text-lg px-8 py-1 rounded-2xl cursor-pointer mt-16"
        >
          Hire Me!
        </a>
      </div>
    </div>
  );
}
