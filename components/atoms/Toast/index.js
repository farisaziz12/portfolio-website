import React, { useEffect, useState } from "react";

export function Toast({ text, embeddedFormLink, anchorTagLink, shouldUseEmbeddedForm }) {
  const [shouldShowForm, setShouldShowForm] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal("#toast", {
      delay: 1000,
      distance: "-350%",
      origin: "bottom",
      reset: true,
    });
  }, []);

  const renderButton = () => {
    const buttonText = text || "Hire Me!";
    const classes =
      "load-hidden absolute z-10 text-center bg-white text-black font-bold tracking-wider text-lg px-10 py-1.5 rounded-2xl cursor-pointer mt-16";

    if (shouldUseEmbeddedForm) {
      return (
        <button onClick={() => setShouldShowForm(true)} id="toast" className={classes}>
          {buttonText}
        </button>
      );
    } else {
      return (
        <a
          href={
            anchorTagLink || "mailto:farisaziz12@gmail.com?subject=Faris, you're hired!"
          }
          id="toast"
          className={classes}
        >
          {buttonText}
        </a>
      );
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">{renderButton()}</div>
      {shouldShowForm && (
        <Form
          closeForm={() => setShouldShowForm(false)}
          embeddedFormLink={embeddedFormLink}
        />
      )}
    </>
  );
}

function Form({ closeForm, embeddedFormLink }) {
  return (
    <div
      className="w-screen h-screen fixed z-20"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <button onClick={closeForm} className="fixed right-0 px-8 py-4 cursor-pointer z-30">
        Close
      </button>
      <iframe
        id="form"
        className="fixed w-screen h-screen lg:p-12 pt-12 pb-2 px-2"
        src={embeddedFormLink || "https://form.typeform.com/to/R4OSbmBh"}
      />
    </div>
  );
}
