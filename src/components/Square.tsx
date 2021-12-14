import React, { CSSProperties, FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { controller } from "../lib/Controller";
import { Field, TrashedField } from "../lib/Model";
import { StudentComp } from "./Student";
import styles from "./Square.module.css";

export interface SquareProps {
  initialField: Field;
}

export const Square: FC<SquareProps> = ({ initialField }) => {
  const [field, setField] = useState<Field>(initialField);
  useEffect(() => controller.observe(field.id, setField), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (originField: TrashedField) => {
      if (originField.trashed) {
        controller.restoreField(originField, field.id);
      } else {
        controller.moveStudent(originField.id, field.id, originField.isTable);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const squareStyles: CSSProperties = {
    position: "relative",
    background: isOver ? "lightgrey" : "transparent",
    boxShadow: isOver
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "",
    transform: isOver ? "scale(1.1) translateY(-4px)" : "",
    transition: "all 300ms ease",
    zIndex: isOver ? 2 : 1,
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!e.ctrlKey) {
      return;
    } else {
      !field.isTable && controller.toggleTable(field.id);
    }
  };

  return (
    <div
      ref={drop}
      style={squareStyles}
      className={styles.table}
      onMouseMove={handleMouseMove}
      onDoubleClick={() => controller.toggleTable(field.id)}
    >
      <StudentComp key={field.id} field={field} />
    </div>
  );
};
