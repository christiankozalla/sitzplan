import { FC, useState } from "react";
import { Room } from "../lib/Room";
import styles from "./ClassroomEditor.module.css";

interface ClassroomEditorProps {
  room: Room;
}

export const ClassroomEditor: FC<ClassroomEditorProps> = ({ room }) => {
  const [studentName, setStudentName] = useState("");

  const addStudent = () => {
    studentName && room.assignNewStudent(studentName);
    setStudentName("");
  };

  return (
    <header className={styles.editor}>
      <p>Sitzplan Logo</p>
      <div className={styles.editorControls}>
        <div>
          <label htmlFor="add-student"></label>
          <input
            id="add-student"
            type="text"
            value={studentName}
            placeholder="Schülername"
            className={styles.addStudent}
            onChange={(e) => setStudentName(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && addStudent()}
          />
          <button onClick={addStudent}>+</button>
        </div>
        <div>
          <span className="mx-1">Vorlagen</span>
          <button onClick={() => room.generateTablePreset(3)}>
            Vorlage |||
          </button>
        </div>
      </div>
    </header>
  );
};
