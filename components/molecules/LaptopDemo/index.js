import React, { useEffect, useState } from "react";
import Image from "next/image";
import { macImg } from "../../../assets";
import { resolveVideoSource } from "../../../utils";

export function LaptopDemo({ computer: { name } }) {
  const [shouldShowVideo, setShouldShowVideo] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal("#laptop-demo", { delay: 250 });
  }, []);

  const handleLoadedImage = () => {
    setShouldShowVideo(true);
  };

  return (
    <div
      id="laptop-demo"
      style={{ marginBottom: "-3vw" }}
      className={
        "lg:flex hidden justify-center" + (shouldShowVideo ? "" : " items-center")
      }
    >
      <div style={{ position: "relative", height: "32vw", width: "45vw" }}>
        <Image
          layout="fill"
          objectFit="contain"
          className="drop-shadow-2xl"
          src={macImg.src}
          onLoad={handleLoadedImage}
          alt="laptop-demo"
        />
      </div>
      {shouldShowVideo ? (
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
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}
