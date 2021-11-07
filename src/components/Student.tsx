import { CSSProperties, FC } from "react";
import { Student } from "../lib/Types";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";

interface StudentCompProps {
  student?: Student;
}

const tableStyles: CSSProperties = {
  cursor: "move",
  height: "100%",
  width: "100%",
  textAlign: "center",
};

export const StudentComp: FC<StudentCompProps> = ({ student }) => {
  const [_, drag] = useDrag({
    type: ItemTypes.STUDENT,
    item: {
      ...student,
    },
  });

  if (student) {
    return (
      <div ref={drag} style={tableStyles}>
        {student.name}
      </div>
    );
  } else {
    return null;
  }
};
