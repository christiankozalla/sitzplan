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
            <div>
              {controller.getFields().map((field) => (
                <StudentTag
                  key={field.id}
                  initialField={field}
                  onClickHandler={setSelectedField}
                />
              ))}
            </div>
          </div>
          <div id={styles.studentEditor}>
            <StudentEditor field={selectedField} />
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
