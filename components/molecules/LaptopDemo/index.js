import React, { useEffect } from "react";
import Image from "next/image";
import { macImg } from "../../../assets";
import { resolveVideoSource } from "../../../utils";

export function LaptopDemo({ computer: { name } }) {
  useEffect(() => {
    ScrollReveal().reveal("#laptop-demo", { delay: 250 });
  }, []);

  return (
    <div
      id="laptop-demo"
      style={{ marginBottom: "-3vw" }}
      className="lg:flex hidden flex justify-center"
    >
      <div style={{ position: "relative", height: "32vw", width: "45vw" }}>
        <Image
          layout="fill"
          objectFit="contain"
          className="drop-shadow-2xl"
          src={macImg.src}
        />
      </div>
      <video
        style={{
          marginTop: "6.75%",
          position: "absolute",
          display: "block",
          height: "18vw",
          width: "auto",
          marginLeft: "0.05vw",
        }}
        className="drop-shadow-2xl"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src={resolveVideoSource(name)} type="video/mp4"></source>
      </video>
    </div>
  );
}
