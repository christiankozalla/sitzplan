import { FC, CSSProperties, useState } from "react";
import { Square } from "./Square";
import { Room } from "../lib/Room";

export interface ClassroomProps {
  room: Room;
}

const boardStyles: CSSProperties = {
  width: "75%",
  height: "100%",
  display: "flex",
  flexWrap: "wrap",
};

const asideStyles: CSSProperties = {
  width: "25%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

export const Classroom: FC<ClassroomProps> = ({ room }) => {
  const [studentName, setStudentName] = useState("");

  const numberOfSquares = 100;
  const rootNumberOfSquares = Math.sqrt(numberOfSquares);
  const squareStyles: CSSProperties = {
    width: `${rootNumberOfSquares}%`,
    height: `${rootNumberOfSquares}%`,
  };

  const addStudent = () => {
    room.assignNewStudent(studentName);
    setStudentName("");
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={boardStyles}>
        {Object.values(room.getFields()).map((field) => {
          return (
            <div key={field.id} style={squareStyles}>
              <Square field={field} room={room} />
            </div>
          );
        })}
      </div>
      <aside style={asideStyles}>
        <h2>Editor</h2>
        <h3>Tisch Anordnung</h3>
        <button onClick={() => room.generateTablePreset(3)}>
          Parallele Reihen
        </button>
        <label htmlFor="add-student">Neuer Schüler</label>
        <input
          id="add-student"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button onClick={addStudent}>+</button>
      </aside>
    </div>
  );
};
