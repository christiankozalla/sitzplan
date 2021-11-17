import { FC } from "react";
import { Field } from "../lib/Types";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import "./Student.css";

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
        className="student"
        style={{ backgroundColor: field.isTable ? "coral" : "lightgrey" }}
      >
        {field.student?.name || null}
      </div>
    );
  } else {
    return null;
  }
};
