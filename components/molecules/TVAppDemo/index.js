import React, { useEffect } from "react";
import Image from "next/image";
import { samsungTV } from "../../../assets";

export function TVAppDemo() {
  useEffect(() => {
    ScrollReveal().reveal("#tv-demo", { delay: 250 });
  }, []);

  return (
    <div id="tv-demo" className="lg:visible invisible flex justify-center">
      <div style={{ position: "relative", height: "27vw", width: "50vw" }}>
        <Image
          layout="fill"
          objectFit="contain"
          className="drop-shadow-2xl"
          src={samsungTV.src}
        />
      </div>
      <video
        style={{
          marginTop: "2.85%",
          position: "absolute",
          display: "block",
          height: "18.9vw",
          width: "auto",
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src="/video/tv-app.mp4" type="video/mp4"></source>
      </video>
    </div>
  );
}
