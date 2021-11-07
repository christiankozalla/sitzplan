import { FC, useState, useEffect, CSSProperties, SetStateAction } from "react";
import { Table } from "./Table";
import { StudentComp } from "./Student";
import { Room } from "../lib/Room";

import { Student, Position } from "../lib/Types";

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
  const [students, setStudentPos] = useState<Student[]>(room.students);
  const [tables, setTablePos] = useState<Position[]>(room.tables);

  useEffect(() => room.observeStudents(setStudentPos));
  useEffect(() => room.observeTables(setTablePos));

  useEffect(() => {}, [tables]);

  function renderTable(i: number) {
    const x = i % 10; // Number of columns 0-9
    const y = Math.floor(i / 10); // Number of rows 0-9
    const student = students.find(
      ({ position: [posX, posY] }) => x === posX && y === posY
    );
    const isTable = tables.some(([tabX, tabY]) => x === tabX && y === tabY);

    console.log("RENDERED!", i);

    return (
      <div key={i} style={squareStyles}>
        <Table x={x} y={y} room={room} isTable={isTable}>
          <StudentComp student={student} />
        </Table>
      </div>
    );
  }

  const squares = [];
  const numberOfSquares = 100;
  const rootNumberOfSquares = Math.sqrt(numberOfSquares);
  const squareStyles: CSSProperties = {
    width: `${rootNumberOfSquares}%`,
    height: `${rootNumberOfSquares}%`,
  };

  for (let i = 0; i < numberOfSquares; i++) {
    squares.push(renderTable(i));
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={boardStyles}>{squares}</div>
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
