import { FC, ChangeEvent, SetStateAction, Dispatch } from "react";
import { controller } from "../App";
import { Field, GenderTypes, RowTypes } from "../lib/Model";
import styles from "./StudentEditor.module.css";

interface StudentEditorProps {
  field: Field;
  selectNeighborsForId: string;
  setSelectNeighborsForId: Dispatch<SetStateAction<Field["id"]>>;
}

export const StudentEditor: FC<StudentEditorProps> = ({
  field,
  selectNeighborsForId,
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
      <div className={styles.studentEditor}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>m|w</th>
              <th>Reihe</th>
              <th>Verbotene Nachbarn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{field.student.name}</td>
              <td>{field.student.row ?? "-"}</td>
              <td>
                {field.student.gender
                  ? field.student.gender === "male"
                    ? "Junge"
                    : "Mädchen"
                  : "-"}
              </td>
              <td>
                {field.student.forbiddenNeighbors.length
                  ? field.student.forbiddenNeighbors.map((name) => (
                      <span key={name} className={styles.forbiddenNeighbor}>
                        {name}
                      </span>
                    ))
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.editorItem}>
          <label htmlFor="name" className={styles.description}>
            Name des Schülers
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            defaultValue={field.student.name}
            onChange={handleChangeName}
          />
        </div>
        <div className={styles.editorItem}>
          <label htmlFor="gender" className={styles.description}>
            Wähle, ob Schüler:in männlich oder weiblich ist.
          </label>
          <select
            name="gender"
            id="gender"
            onChange={handleChangeGender}
            defaultValue={field.student.gender}
          >
            <option value={undefined}>Wähle m|w</option>
            <option value="female">weiblich</option>
            <option value="male">männlich</option>
          </select>
        </div>
        <div className={styles.editorItem}>
          <label htmlFor="row" className={styles.description}>
            Wähle, in welcher Reihe der Schüler:in sitzen soll.
          </label>
          <select
            name="row"
            id="row"
            defaultValue={field.student.row}
            onChange={handleChangeRow}
          >
            <option value={undefined}>Wähle Reihe</option>
            <option value="first">erste</option>
            <option value="last">letzte</option>
          </select>
        </div>
        <div className={styles.editorItem}>
          <p className={styles.description}>
            Wähle aus, neben wem der Schüler:in nicht sitzen darf
          </p>
          <button
            className={styles.selectForbiddenNeighborsButton}
            onClick={() =>
              setSelectNeighborsForId((prevId) =>
                prevId === field.id ? "" : field.id
              )
            }
            dangerouslySetInnerHTML={{
              __html:
                selectNeighborsForId === field.id
                  ? "&times;"
                  : "Verbotene Sitznachbarn wählen",
            }}
            style={{
              backgroundColor:
                selectNeighborsForId === field.id
                  ? "var(--color-attention)"
                  : "var(--color-primary-dark)",
            }}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};
