import { CSSProperties, FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field, TrashedField } from "../lib/Types";
import { StudentComp } from "./Student";
import styles from "./Square.module.css";

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
      } else {
        room.moveStudent(originField.id, field.id, originField.isTable);
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

  return (
    <div ref={drop} style={squareStyles}>
      <div
        className={styles.table}
        onDoubleClick={() => room.toggleTable(field.id)}
      >
        <StudentComp key={field.id} field={field} />
      </div>
    </div>
  );
};
