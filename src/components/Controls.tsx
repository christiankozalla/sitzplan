import { FC, useState } from "react";
import { AddStudent } from "./AddStudent";
import { Conditions } from "./Conditions";
import { Modal } from "./Modal";
import styles from "./Controls.module.css";

import AddStudentIcon from "../assets/person-add-outline.svg";
import ClassDocumentIcon from "../assets/document-text-outline.svg";
import SettingsIcon from "../assets/settings-outline.svg";
import SaveIcon from "../assets/save-outline.svg";

export const Controls: FC = () => {
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showConditions, setShowConditions] = useState(false);

  return (
    <div className={styles.controls}>
      {showAddStudentDialog && (
        <div className={styles.addStudent}>
          <AddStudent />
        </div>
      )}
      <Modal
        isOpen={showConditions}
        setOpen={setShowConditions}
        action={<button>Generiere</button>}
      >
        <Conditions />
      </Modal>
      <div className={styles.tooltip} data-tooltip="Füge einen Schüler hinzu">
        <img
          src={AddStudentIcon}
          alt="Füge einen Schüler hinzu"
          className={styles.icon}
          onClick={() => setShowAddStudentDialog((prevShow) => !prevShow)}
        />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Stelle konkrete Schüler-Sitzplan-Bedingungen auf!"
      >
        <img
          src={ClassDocumentIcon}
          alt="Sitzplan Info"
          className={styles.icon}
          onClick={() => setShowConditions((prevShow) => !prevShow)}
        />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Mehr Einstellungen für deinen Sitzplan...!"
      >
        <img src={SettingsIcon} alt="Einstellungen" className={styles.icon} />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Speichere deinen Sitzplan als PDF!"
      >
        <img
          src={SaveIcon}
          alt="Speichere Sitzplan as PDF"
          className={styles.icon}
          onClick={() =>
            import("../lib/GeneratePdf").then((module) => module.generatePdf())
          }
        />
      </div>
    </div>
  );
};
