import { FC, useState } from "react";
import { RecycleBin } from "./RecycleBin";
import { Room } from "../lib/Room";
import "./ClassroomEditor.css";

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
    <header className="editor pt-2 pb-2 mb-2">
      <p id="logo-editor">Sitzplan Logo</p>
      <div className="editor__controls">
        <div>
          <label htmlFor="add-student"></label>
          <input
            id="add-student"
            type="text"
            value={studentName}
            placeholder="Schülername"
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
