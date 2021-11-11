import { CSSProperties, FC } from "react";
import { Field } from "../lib/Types";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../lib/Constants";

interface StudentCompProps {
  field: Field;
}

export const StudentComp: FC<StudentCompProps> = ({ field }) => {
  const [_, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: {
      ...field,
    },
  });

  const tableStyles: CSSProperties = {
    cursor: "move",
    height: "100%",
    width: "100%",
    textAlign: "center",
    background: field.isTable ? "coral" : "lightgrey",
  };
  if (field.student || field.isTable) {
    return (
      <div ref={drag} style={tableStyles}>
        {field.student?.name || null}
      </div>
    );
  } else {
    return null;
  }
};
