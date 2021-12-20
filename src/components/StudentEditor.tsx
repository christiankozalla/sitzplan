import { FC, ChangeEvent } from "react";
import { controller } from "../lib/Controller";
import { Field, GenderTypes } from "../lib/Model";
import styles from "./StudentEditor.module.css";

interface StudentEditorProps {
  field: Field | undefined;
}

export const StudentEditor: FC<StudentEditorProps> = ({ field }) => {
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    field &&
      field.student &&
      controller.setStudent(field.id, {
        name: e.currentTarget.value,
      });
  };

  const handleChangeGender = (e: ChangeEvent<HTMLSelectElement>) => {
    field &&
      field.student &&
      controller.setStudent(field.id, {
        gender: e.currentTarget.value as GenderTypes,
      });
  };

  if (field && field.student) {
    return (
      <>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            defaultValue={field.student.name}
            onChange={handleChangeName}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender </label>
          <select
            name="gender"
            id="gender"
            onChange={handleChangeGender}
            defaultValue={field.student.gender}
          >
            <option value={undefined}>Wähle...</option>
            <option value="female">weiblich</option>
            <option value="male">männlich</option>
          </select>
        </div>
      </>
    );
  } else {
    return (
      <div className={styles.noStudent}>
        <p>Im Moment ist kein Schüler ausgewählt.</p>
        <p>
          Bitte wähle einen Schüler rechts aus der Liste oder füge neue Schüler
          hinzu.
        </p>
      </div>
    );
  }
};
