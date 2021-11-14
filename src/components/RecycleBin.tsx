import { CSSProperties, FC } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field } from "../lib/Types";

interface RecycleBinProps {
  room: Room;
}

export const RecycleBin: FC<RecycleBinProps> = ({ room }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (field: Field) => {
      room.resetField(field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const recycleBinStyles: CSSProperties = {
    width: "100%",
    transform: isOver ? "translateY(-4px)" : "",
    transition: "transform 300ms ease",
  };

  return (
    <button ref={drop} style={recycleBinStyles}>
      Recycle
    </button>
  );
};
