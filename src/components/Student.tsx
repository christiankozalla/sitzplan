import { CSSProperties, FC } from "react";
import { Field } from "../lib/Types";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";

interface StudentCompProps {
  field: Field;
}

const tableStyles: CSSProperties = {
  cursor: "move",
  height: "100%",
  width: "100%",
  textAlign: "center",
};

export const StudentComp: FC<StudentCompProps> = ({ field }) => {
  const [_, drag] = useDrag({
    type: ItemTypes.STUDENT,
    item: {
      id: field.id,
    },
  });

  if (field.student) {
    return (
      <div ref={drag} style={tableStyles}>
        {field.student.name}
      </div>
    );
  } else {
    return null;
  }
};
