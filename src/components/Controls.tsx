import React, { FC, useState } from "react";
import { AddStudent } from "./AddStudent";
import styles from "./Controls.module.css";

import AddStudentIcon from "../assets/person-add-outline.svg";
import ClassDocumentIcon from "../assets/document-text-outline.svg";
import SettingsIcon from "../assets/settings-outline.svg";
import SaveIcon from "../assets/save-outline.svg";

export const Controls: FC = () => {
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  return (
    <div className={styles.controls}>
      {showAddStudentDialog && <AddStudent />}
      <img
        src={AddStudentIcon}
        alt="Füge einen Schüler hinzu"
        className={styles.icon}
        onClick={() => setShowAddStudentDialog((prevShow) => !prevShow)}
      />
      <img
        src={ClassDocumentIcon}
        alt="Sitzplan Info"
        className={styles.icon}
      />
      <img src={SettingsIcon} alt="Einstellungen" className={styles.icon} />
      <img
        src={SaveIcon}
        alt="Speichere Sitzplan as PDF"
        className={styles.icon}
      />
    </div>
  );
};
