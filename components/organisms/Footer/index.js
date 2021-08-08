import React from "react";
import { emojisplosion } from "emojisplosion";
import { registerEvent } from "../../../utils";

export function Footer({ footerLinks }) {
  const renderLinks = () => {
    if (footerLinks[0]) {
      return footerLinks.map(({ link, title }, index) => (
        <a
          onClick={() => registerEvent(`${title} Footer Link Clicked`)}
          className="underline text-lg"
          target="_blank"
          href={link}
          key={index}
        >
          {title}
        </a>
      ));
    }
  };

  const handleEmojisplosion = () => {
    emojisplosion();
    registerEvent("emojisplosion triggered");
  };

  return (
    <div className="w-screen border-t-4 h-24">
      <h1 className="text-center p-2 cursor-pointer" onClick={handleEmojisplosion}>
        Made with<span className="ml-1 mr-2">❤️</span>by Faris Aziz
      </h1>
      <div className="flex justify-evenly">{renderLinks()}</div>
    </div>
  );
}
