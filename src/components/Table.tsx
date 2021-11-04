import { CSSProperties, FC } from "react";
import { Student } from "../lib/Types";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";

interface TableProps {
  student?: Student;
}

const tableStyles: CSSProperties = {
  cursor: "move",
  height: "100%",
  width: "100%",
  textAlign: "center",
};

export const Table: FC<TableProps> = ({ student }) => {
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
