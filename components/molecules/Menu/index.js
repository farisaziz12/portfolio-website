import React from "react";
import styles from "./styles";

export function Menu({ toggle }) {
  return (
    <div className="block lg:hidden">
      <button onClick={toggle} className={styles.button}>
        <svg
          className={styles.svg}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
  );
}
