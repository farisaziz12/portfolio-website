import React, { useEffect, useState } from "react";
import styles from "./styles";

export function Toast({
  text,
  embeddedFormLink,
  anchorTagLink,
  shouldUseEmbeddedForm,
  shouldShowToast,
}) {
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

    if (shouldUseEmbeddedForm) {
      return (
        <button
          onClick={() => setShouldShowForm(true)}
          id="toast"
          className={styles.toastButton}
        >
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
          className={styles.toastButton}
        >
          {buttonText}
        </a>
      );
    }
  };

  return (
    <>
      <div className={styles.toastContainer}>{shouldShowToast && renderButton()}</div>
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
    <div className={styles.formContainer} style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
      <button onClick={closeForm} className={styles.formCancelButton}>
        Close
      </button>
      <iframe
        id="form"
        className={styles.form}
        src={embeddedFormLink || "https://form.typeform.com/to/R4OSbmBh"}
      />
    </div>
  );
}
