import React, { useEffect, useState } from "react";
import Image from "next/image";
import { samsungTV } from "../../../assets";

export function TVAppDemo() {
  const [shouldShowVideo, setShouldShowVideo] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal("#tv-demo", { delay: 250 });
  }, []);

  const handleLoadedImage = () => {
    setShouldShowVideo(true);
  };

  return (
    <div
      id="tv-demo"
      style={{ marginBottom: "-3vw" }}
      className={
        "lg:flex hidden justify-center" + (shouldShowVideo ? "" : " items-center")
      }
    >
      <div style={{ position: "relative", height: "27vw", width: "50vw" }}>
        <Image
          layout="fill"
          objectFit="contain"
          className="drop-shadow-2xl"
          src={samsungTV.src}
          onLoad={handleLoadedImage}
          alt="tv-demo"
        />
      </div>
      {shouldShowVideo ? (
        <video
          style={{
            marginTop: "2.86%",
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
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}
