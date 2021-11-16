import { CSSProperties, FC, useState } from "react";
import { RecycleBin } from "./RecycleBin";
import { Room } from "../lib/Room";

interface ClassroomEditorProps {
  room: Room;
}

const asideStyles: CSSProperties = {
  width: "25%",
  minHeight: "100%",
};

const asideBlockStyles: CSSProperties = {
  borderRadius: "4px",
  border: "1px solid lightgrey",
  padding: "8px",
  margin: "12px 0px",
};

export const ClassroomEditor: FC<ClassroomEditorProps> = ({ room }) => {
  const [studentName, setStudentName] = useState("");

  const addStudent = () => {
    studentName && room.assignNewStudent(studentName);
    setStudentName("");
  };

  return (
    <aside style={asideStyles}>
      <h2>Editor</h2>
      <div style={asideBlockStyles}>
        <h3>Vorlage</h3>
        <button
          onClick={() => room.generateTablePreset(3)}
          style={{ width: "100%" }}
        >
          Parallele Reihen
        </button>
      </div>
      <div style={asideBlockStyles}>
        <label htmlFor="add-student">
          <h3>Neuer Schüler</h3>
        </label>
        <input
          id="add-student"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ width: "100%" }}
          onKeyUp={(e) => e.key === "Enter" && addStudent()}
        />
        <button
          onClick={addStudent}
          style={{ width: "100%", marginTop: "8px" }}
        >
          +
        </button>
      </div>
      <div style={asideBlockStyles}>
        <h3>Neuen Tisch erstellen </h3>
        <p>
          <em>Doppelklick auf ein freies Feld</em>
        </p>
      </div>
      <div style={asideBlockStyles}>
        <h3>Platz löschen</h3>
        <RecycleBin room={room} />
      </div>
    </aside>
  );
};
