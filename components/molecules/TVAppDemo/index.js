import React from "react";
import { samsungTV } from "../../../assets";

export function TVAppDemo() {
  return (
    <div className="lg:visible invisible flex justify-center">
      <img style={{ height: "27vw" }} className="drop-shadow-2xl" src={samsungTV.src} />
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
