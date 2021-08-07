import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Menu, Toast } from "../../";
import { resolveNavItems } from "../../../utils";
import styles from "./styles";

export function Navbar({ sections, toast }) {
  const [showMenu, setShowMenu] = useState(false);
  const [navbarItems, setNavbarItems] = useState(resolveNavItems(sections));
  const toggleShowMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  useEffect(() => {
    const navBar = document.getElementById("navbar");
    const downloadButton = document.getElementById("downloadButton");
    const stylesArr = styles.navBackground.split(" ");
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop >= 200 || document.documentElement.scrollTop >= 200) {
        if (!Array.from(navBar.classList).includes(stylesArr[0])) {
          stylesArr.forEach((style) => {
            navBar.classList.add(style);
          });
          downloadButton.classList.add("border-2");

          setNavbarItems((prevState) => [
            { name: "Back To Top", link: "top" },
            ...prevState,
          ]);
        }
      } else {
        if (Array.from(navBar.classList).includes(stylesArr[0])) {
          stylesArr.forEach((style) => {
            navBar.classList.remove(style);
          });
          downloadButton.classList.remove("border-2");

          setNavbarItems((prevState) => prevState.slice(1, prevState.length));
        }
      }
    });
  }, []);

  return (
    <>
      <Toast {...toast} />
      <nav id="top" className={styles.navbar}>
        <div className={styles.navbarTitleContainer}>
          <h1 className={styles.navbarTitle}>Faris Aziz</h1>
        </div>
        <Menu toggle={toggleShowMenu} />
        <div
          id="navbar"
          className={styles.navbarItemsContainer + (showMenu ? "" : " hidden")}
        >
          <div className={styles.navbarItems}>
            {navbarItems.map(({ name, link }, index) => (
              <Link
                key={index}
                to={link}
                spy
                hashSpy
                smooth
                className={styles.navbarItem}
              >
                {name}
              </Link>
            ))}
          </div>
          <div>
            <a
              target="_blank"
              id="downloadButton"
              href="/pdf/CV.pdf"
              download="faris_aziz_cv"
              className={styles.button}
            >
              Download CV
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
