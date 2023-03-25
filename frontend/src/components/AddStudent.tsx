import { FC, useState, Dispatch, SetStateAction } from "react";
import { controller } from "../App";
import styles from "./AddStudent.module.css";

interface AddStudentProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddStudent: FC<AddStudentProps> = ({ setOpen }) => {
  const [studentName, setStudentName] = useState("");

  const handleNewStudent = () => {
    controller.assignNewStudent(studentName.trim());
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
        onKeyUp={(e) => e.key === "Enter" && handleNewStudent()}
        onBlur={() => setOpen(false)}
      />
      <button className={styles.addStudentButton} onClick={handleNewStudent}>
        +
      </button>
    </div>
  );
};
