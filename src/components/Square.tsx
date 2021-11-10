import { CSSProperties, FC, ReactNode, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field } from "../lib/Types";

import { StudentComp } from "./Student";

export interface SquareProps {
  room: Room;
  field: Field;
}

export const Square: FC<SquareProps> = ({ field, room }) => {
  const [localField, setLocalField] = useState<Field>(field);
  useEffect(() => room.observeRoom(localField.id, setLocalField), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.STUDENT,
    drop: (originField: { id: Field["id"] }) =>
      room.moveStudent(originField.id, localField.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  let tableStyles: CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    margin: 0,
    border: "1px solid white",
    background: localField.isTable
      ? "coral"
      : isOver
      ? "darkgrey"
      : "lightgrey",
  };

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxShadow: isOver
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "",
        transform: isOver ? "translate(4px, -4px)" : "",
        transition: "all 300ms ease",
        zIndex: isOver ? 2 : 1,
      }}
    >
      <div style={tableStyles}>
        <StudentComp key={localField.id} field={localField} />
      </div>
    </div>
  );
};
