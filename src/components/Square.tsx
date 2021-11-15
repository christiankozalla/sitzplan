import { CSSProperties, FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field, TrashedField } from "../lib/Types";

import { StudentComp } from "./Student";

export interface SquareProps {
  room: Room;
  initialField: Field;
}

export const Square: FC<SquareProps> = ({ initialField, room }) => {
  const [field, setField] = useState<Field>(initialField);
  useEffect(() => room.observeRoom(field.id, setField), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (originField: Field & TrashedField) => {
      if (originField.trashed) {
        room.restoreField(originField, field.id);
      } else if (originField.isTable && originField.student === undefined) {
        room.moveStudent(originField.id, field.id, true);
      } else {
        room.moveStudent(originField.id, field.id, false);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const squareStyles: CSSProperties = {
    position: "relative",
    background: isOver ? "darkgrey" : "lightgrey",
    boxShadow: isOver
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "",
    transform: isOver ? "translate(4px, -4px)" : "",
    transition: "all 300ms ease",
    zIndex: isOver ? 2 : 1,
  };

  const tableStyles: CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    margin: 0,
    border: "1px solid white",
  };

  return (
    <div ref={drop} style={squareStyles}>
      <div style={tableStyles} onDoubleClick={() => room.toggleTable(field.id)}>
        <StudentComp key={field.id} field={field} />
      </div>
    </div>
  );
};
