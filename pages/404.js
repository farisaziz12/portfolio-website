import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { facePalmPic } from "../assets";
import { HeadTag } from "../components";

export default function Custom404() {
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevState) => {
        if (prevState === 4) {
          router.push("/");
          return 0;
        } else {
          return prevState + 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen w-screen inline-flex flex-wrap justify-center items-center">
      <HeadTag />
      <img
        className="justify-self-center lg:w-96 lg:h-96 md:w-auto md:h-auto h-64 w-64 border-b-8 drop-shadow-2xl"
        src={facePalmPic.src}
        alt="Faris Aziz Profile Picture"
      />
      <h1 className="justify-self-center text-3xl p-3 md:text-4xl lg:text-6xl text-white text-center">
        Error 404 - Nothing to see here
      </h1>
      <div className="w-screen text-center">
        <h2 className="justify-self-center text-l pb-3 md:text-xl lg:text-3xl text-white">
          Taking you home in {5 - counter}
        </h2>
      </div>
    </div>
  );
}
