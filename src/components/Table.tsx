import { CSSProperties, FC, ReactNode, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field } from "../lib/Types";

import { StudentComp } from "./Student";

export interface TableSquareProps {
  room: Room;
  field: Field;
}

export const Table: FC<TableSquareProps> = ({ field, room }) => {
  const [localField, setLocalField] = useState<Field>(field);
  useEffect(() => room.observeRoom(localField.id, setLocalField), []);

  let tableStyles: CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    margin: 0,
    border: "1px solid white",
    background: localField.isTable ? "coral" : "lightgrey",
  };

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.STUDENT,
      drop: (originField: { id: Field["id"] }) =>
        room.moveStudent(originField.id, localField.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [localField]
  );

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={tableStyles}>
        <StudentComp field={localField} />
      </div>
    </div>
  );
};
