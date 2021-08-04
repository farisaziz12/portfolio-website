import React, { useState } from "react";
import { Link } from "react-scroll";
import { Menu } from "../../molecules";
import { navItems } from "./navItems";
import styles from "./styles";

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleShowMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarTitleContainer}>
          <h1 className={styles.navbarTitle}>Faris Aziz</h1>
        </div>
        <Menu toggle={toggleShowMenu} />
        <div className={styles.navbarItemsContainer + (showMenu ? "" : " hidden")}>
          <div className={styles.navbarItems}>
            {navItems.map(({ name, link }, index) => (
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
            <a href="" className={styles.button}>
              Download CV
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
