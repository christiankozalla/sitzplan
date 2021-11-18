import { FC } from "react";
import { Field } from "../lib/Types";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
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
        style={{ backgroundColor: field.isTable ? "#38C793" : "transparent" }}
      >
        {field.student?.name || null}
      </div>
    );
  } else {
    return null;
  }
};
