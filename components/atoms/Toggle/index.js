import React from "react";

export function Toggle({ isChecked, toggleChecked, name, className = "" }) {
  return (
    <div
      className={
        (name && "grid place-content-start md:place-items-center sm:place-items-start ") +
        className
      }
    >
      <div
        onClick={toggleChecked}
        className={
          "w-14 h-8 flex items-center rounded-full p-1 duration-300 cursor-pointer" +
          (isChecked ? " bg-green-500" : " bg-gray-300")
        }
      >
        <div
          className={
            "bg-white w-6 h-6 rounded-full shadow-md transform duration-300" +
            (isChecked ? " translate-x-6" : "")
          }
        ></div>
      </div>
      <h1>{name}</h1>
    </div>
  );
}
