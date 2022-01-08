import { FC } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Field } from "../lib/Model";
import styles from "./Student.module.css";

interface StudentCompProps {
  field: Field;
}

export const StudentComp: FC<StudentCompProps> = ({ field }) => {
  const [_, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: field,
  });

  if (field.student || field.isTable) {
    return (
      <div
        ref={drag}
        className={styles.student}
        style={{
          backgroundColor: field.isTable
            ? "var(--color-primary-dark)"
            : "transparent",
        }}
      >
        {!field.student ? null : field.student.name || "Name fehlt!"}
      </div>
    );
  } else {
    return null;
  }
};
