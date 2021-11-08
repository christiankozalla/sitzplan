import { FC, CSSProperties } from "react";
import { Table } from "./Table";
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
  const numberOfSquares = 100;
  const rootNumberOfSquares = Math.sqrt(numberOfSquares);
  const squareStyles: CSSProperties = {
    width: `${rootNumberOfSquares}%`,
    height: `${rootNumberOfSquares}%`,
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={boardStyles}>
        {Object.values(room.getFields()).map((field) => {
          return (
            <div key={field.id} style={squareStyles}>
              <Table field={field} room={room}></Table>
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
        <input id="add-student" type="text" />
      </aside>
    </div>
  );
};
