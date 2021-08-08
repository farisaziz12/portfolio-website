import { useEffect } from "react";
import { Link } from "react-scroll";
import { profilePic } from "../../../assets";
import { registerEvent } from "../../../utils";
import styles from "./styles";

export function Intro() {
  useEffect(() => {
    ScrollReveal().reveal("#intro", { delay: 100 });
    ScrollReveal().reveal("#intro-text", { delay: 250, scale: 0.85, reset: true });
  }, []);
  return (
    <div id="intro" className={styles.container}>
      <img className={styles.img} src={profilePic.src} alt="Faris Aziz Profile Picture" />
      <h1 id="intro-text" className={styles.title}>
        Hi, my name is <strong>Faris!</strong>
      </h1>
      <h2 className={styles.subtitle}>I am a Full Stack Software Engineer</h2>
      <Link
        onClick={() => registerEvent("Learn More Button Clicked")}
        to="learn-more"
        offset={-100}
        spy
        hashSpy
        smooth
        className={styles.button}
      >
        Learn More!
      </Link>
    </div>
  );
}
