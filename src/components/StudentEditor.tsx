import { FC, ChangeEvent, SetStateAction, Dispatch } from "react";
import { controller } from "../App";
import { Field, GenderTypes, RowTypes } from "../lib/Model";
import styles from "./StudentEditor.module.css";

interface StudentEditorProps {
  field: Field;
  setSelectNeighborsForId: Dispatch<SetStateAction<Field["id"]>>;
}

export const StudentEditor: FC<StudentEditorProps> = ({
  field,
  setSelectNeighborsForId,
}) => {
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    field.student &&
      controller.setStudent(field.id, {
        name: e.currentTarget.value,
      });
  };

  const handleChangeGender = (e: ChangeEvent<HTMLSelectElement>) => {
    field.student &&
      controller.setStudent(field.id, {
        gender: e.currentTarget.value as GenderTypes,
      });
  };

  const handleChangeRow = (e: ChangeEvent<HTMLSelectElement>) => {
    field.student &&
      controller.setStudent(field.id, {
        row: e.currentTarget.value as RowTypes,
      });
  };

  if (field.student) {
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
        <div>
          <label htmlFor="row">Muss in {field.student.row} Reihe sitzen</label>
          <select
            name="row"
            id="row"
            defaultValue={field.student.row}
            onChange={handleChangeRow}
          >
            <option value={undefined}>Wähle</option>
            <option value="first">erste</option>
            <option value="last">letzte</option>
          </select>
        </div>
        <div className={styles.forbiddenNeighbors}>
          Darf nicht neben diesen Schülern sitzen{" "}
          {field.student.forbiddenNeighbors?.join(", ")}
          <button onClick={() => setSelectNeighborsForId(field.id)}>
            Schüler auswählen
          </button>
          <button onClick={() => setSelectNeighborsForId("")}>&times;</button>
        </div>
      </>
    );
  } else {
    return null;
  }
};
