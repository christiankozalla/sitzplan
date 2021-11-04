import { CSSProperties, FC, ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Student } from "../lib/Types";

export interface TableSquareProps {
  id: string | undefined;
  x: number;
  y: number;
  children?: ReactNode;
  room: Room;
}

const tableSquareStyles: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  margin: 0,
  border: "1px solid lightgrey",
};

export const TableSquare: FC<TableSquareProps> = ({
  id,
  x,
  y,
  children,
  room,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.STUDENT,
      drop: (student: Student) => room.moveStudent(student, x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [room]
  );

  return (
    <div
      ref={drop}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div style={tableSquareStyles}>{children}</div>
    </div>
  );
};
