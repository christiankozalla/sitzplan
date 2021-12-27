import { FC, useState } from "react";
import { controller } from "../App";
import styles from "./AddStudent.module.css";

export const AddStudent: FC = () => {
  const [studentName, setStudentName] = useState("");

  const handleNewStudent = () => {
    studentName && controller.assignNewStudent(studentName);
    setStudentName("");
  };

  return (
    <div className={styles.addStudent}>
      <label htmlFor="addStudent" className="screenReaderOnly">
        Neuer Schüler
      </label>
      <input
        id="addStudent"
        value={studentName}
        type="text"
        placeholder="Neue:r Schüler:in"
        autoFocus
        onChange={(e) => setStudentName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleNewStudent()}
      />
      <button className={styles.addStudentButton} onClick={handleNewStudent}>
        +
      </button>
    </div>
  );
};
