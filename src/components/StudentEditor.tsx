import { FC, ChangeEvent, SetStateAction, Dispatch } from "react";
import { controller } from "../App";
import { Field, Student } from "../lib/Model";
import styles from "./StudentEditor.module.css";

interface StudentEditorProps {
  field: Field;
  selectNeighborsForId?: string;
  setSelectNeighborsForId?: Dispatch<SetStateAction<Field["id"]>>;
}

export const StudentEditor: FC<StudentEditorProps> = ({
  field,
  selectNeighborsForId,
  setSelectNeighborsForId,
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    propertyName: keyof Student
  ) => {
    const hasChecked = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): e is ChangeEvent<HTMLInputElement> =>
      e.currentTarget.hasOwnProperty("checked");

    if (field.student) {
      controller.setStudent(field.id, {
        [propertyName]: hasChecked(e)
          ? e.currentTarget.checked
          : e.currentTarget.value !== "undefined"
          ? e.currentTarget.value
          : undefined,
      });
    }
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
              <th>Einzeln</th>
              <th>Verbotene Nachbarn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{field.student.name}</td>
              <td>
                {field.student.row
                  ? field.student.row === "first"
                    ? "erste"
                    : "letzte"
                  : "-"}
              </td>
              <td>
                {field.student.gender
                  ? field.student.gender === "male"
                    ? "Junge"
                    : "Mädchen"
                  : "-"}
              </td>
              <td>{field.student.alone ? "Ja" : "Nein"}</td>
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
            onChange={(e) => handleChange(e, "name")}
          />
        </div>
        <div className={styles.editorItem}>
          <label htmlFor="gender" className={styles.description}>
            Wähle, ob Schüler:in männlich oder weiblich ist.
          </label>
          <select
            name="gender"
            id="gender"
            onChange={(e) => handleChange(e, "gender")}
            defaultValue={field.student.gender}
          >
            <option value="undefined">Wähle m|w</option>
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
            onChange={(e) => handleChange(e, "row")}
          >
            <option value="undefined">Wähle Reihe</option>
            <option value="first">erste</option>
            <option value="last">letzte</option>
          </select>
        </div>
        <div className={styles.editorItem}>
          <label htmlFor="alone" className={styles.description}>
            Soll Schüler:in alleine sitzen?
          </label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="alone"
              id="alone"
              defaultChecked={field.student.alone}
              onChange={(e) => handleChange(e, "alone")}
            />
            <span className="checkbox-control"></span>
          </div>
        </div>
        <div className={styles.editorItem}>
          <p className={styles.description}>
            Wähle aus, neben wem der Schüler:in nicht sitzen darf
          </p>
          <button
            className={styles.selectForbiddenNeighborsButton}
            disabled={field.student.alone}
            onClick={() =>
              setSelectNeighborsForId &&
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
