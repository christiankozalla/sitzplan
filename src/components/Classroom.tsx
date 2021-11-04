import { FC, useState, useEffect, CSSProperties } from "react";
import { TableSquare } from "./TableSquare";
import { Table } from "./Table";
import { Room } from "../lib/Room";

import { Student } from "../lib/Types";

export interface ClassroomProps {
  room: Room;
}

const boardStyles: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexWrap: "wrap",
};

const squareStyles: CSSProperties = { width: "12.5%", height: "12.5%" };

export const Classroom: FC<ClassroomProps> = ({ room }) => {
  const [tables, setStudentPos] = useState<Student[]>(room.tables);

  useEffect(() => room.observe(setStudentPos));

  function renderSquare(i: number) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const student = tables.find(
      ({ position: [posX, posY] }) => x === posX && y === posY
    );

    return (
      <div key={i} style={squareStyles}>
        <TableSquare id={student?.id} x={x} y={y} room={room}>
          <Table student={student} />
        </TableSquare>
      </div>
    );
  }

  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i));
  }

  return <div style={boardStyles}>{squares}</div>;
};
