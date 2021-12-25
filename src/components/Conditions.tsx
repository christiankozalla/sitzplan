import { FC, useState, useEffect } from "react";
import { AddStudent } from "./AddStudent";
import { controller } from "../App";
import styles from "./Conditions.module.css";
import { StudentTag } from "./StudentTag";
import { Field } from "../lib/Model";
import { StudentEditor } from "./StudentEditor";

export const Conditions: FC = () => {
  const [selectedField, setSelectedField] = useState<Field>();
  const [selectNeighborsForId, setSelectNeighborsForId] = useState("");

  useEffect(() => {
    if (selectedField) {
      controller.observe(selectedField.id, setSelectedField);
      return () =>
        controller.removeObserver(selectedField.id, setSelectedField);
    }
  }, [selectedField]);

  return (
    <div className={styles.grid}>
      <div id={styles.editorHeadline}>
        <h2>Student Editor</h2>
        <AddStudent />
      </div>
      <div id={styles.studentList}>
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
    </div>
  );
};
