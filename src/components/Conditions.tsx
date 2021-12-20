import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import { AddStudent } from "./AddStudent";
import { controller } from "../lib/Controller";
import styles from "./Conditions.module.css";
import { StudentTag } from "./StudentTag";
import { Field } from "../lib/Model";
import { StudentEditor } from "./StudentEditor";

interface ConditionsProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const Conditions: FC<ConditionsProps> = ({ isOpen, setOpen }) => {
  const [selectedField, setSelectedField] = useState<Field>();
  const [selectNeighborsForId, setSelectNeighborsForId] = useState("");

  useEffect(() => {
    if (selectedField) {
      controller.observe(selectedField.id, setSelectedField);
      return () =>
        controller.removeObserver(selectedField.id, setSelectedField);
    }
  }, [selectedField]);

  if (isOpen) {
    return (
      <div role="dialog" className={styles.dialog}>
        <div className={styles.grid}>
          <div id={styles.editorHeadline}>
            <h2>Student Editor</h2>
          </div>
          <div id={styles.sidebar}>
            <div>
              <AddStudent />
            </div>
            <div className={selectNeighborsForId ? styles.selectNeighbors : ""}>
              {controller.getFields().map((field) => (
                <StudentTag
                  key={field.id}
                  initialField={field}
                  setSelectedField={setSelectedField}
                  selectNeighborsForId={selectNeighborsForId}
                />
              ))}
            </div>
          </div>
          <div id={styles.studentEditor}>
            {selectedField ? (
              <StudentEditor
                key={selectedField.id}
                field={selectedField}
                setSelectNeighborsForId={setSelectNeighborsForId}
              />
            ) : (
              <div className={styles.noStudent}>
                <p>Im Moment ist kein Schüler ausgewählt.</p>
                <p>
                  Bitte wähle einen Schüler rechts aus der Liste oder füge neue
                  Schüler hinzu.
                </p>
              </div>
            )}
          </div>
          <div id={styles.footer}>
            <button>Generiere!</button>
            <button onClick={() => setOpen(false)}>&times;</button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
