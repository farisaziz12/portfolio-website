import React from "react";
import { emojisplosion } from "emojisplosion";

export function Footer({ footerLinks }) {
  const renderLinks = () => {
    if (footerLinks[0]) {
      return footerLinks.map(({ link, title }, index) => (
        <a className="underline text-lg" target="_blank" href={link} key={index}>
          {title}
        </a>
      ));
    }
  };

  return (
    <div className="w-screen border-t-4 h-24">
      <h1 className="text-center p-2 cursor-pointer" onClick={emojisplosion}>
        Made with<span className="ml-1 mr-2">❤️</span>by Faris Aziz
      </h1>
      <div className="flex justify-evenly">{renderLinks()}</div>
    </div>
  );
}
