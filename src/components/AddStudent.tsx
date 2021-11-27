import { FC, useState } from "react";
import { room } from "../lib/Room";

import styles from "./AddStudent.module.css";

interface AddStudentProps {
  x: number;
  y: number;
}

export const AddStudent: FC<AddStudentProps> = ({ x, y }) => {
  const [studentName, setStudentName] = useState("");

  const handleNewStudent = () => {
    studentName && room.assignNewStudent(studentName);
    setStudentName("");
  };

  return (
    <div className={styles.wrapper} style={{ left: x + 20, top: y - 30 }}>
      <label htmlFor="addStudent" className="screenReaderOnly">
        Neuer Schüler
      </label>
      <input
        id="addStudent"
        className={styles.addStudentInput}
        value={studentName}
        placeholder="Neue:r Schüler:in"
        autoFocus
        onChange={(e) => setStudentName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleNewStudent()}
      />
      <button onClick={handleNewStudent}>+</button>
    </div>
  );
};
