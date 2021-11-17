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
    <aside className="aside">
      <h2>Editor</h2>
      <div className="aside__section">
        <h3>Vorlage</h3>
        <button onClick={() => room.generateTablePreset(3)} className="w-100">
          Parallele Reihen
        </button>
      </div>
      <div className="aside__section">
        <label htmlFor="add-student">
          <h3>Neuer Schüler</h3>
        </label>
        <input
          id="add-student"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-100"
          onKeyUp={(e) => e.key === "Enter" && addStudent()}
        />
        <button onClick={addStudent} className="w-100 mt-1">
          +
        </button>
      </div>
      <div className="aside__section">
        <h3>Neuen Tisch erstellen </h3>
        <p>
          <em>Doppelklick auf ein freies Feld</em>
        </p>
      </div>
      <div className="aside__section">
        <h3>Platz löschen</h3>
        <RecycleBin room={room} />
      </div>
    </aside>
  );
};
