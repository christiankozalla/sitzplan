import { CSSProperties, FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field, TrashedField } from "../lib/Types";
import { StudentComp } from "./Student";

interface RecycleBinProps {
  room: Room;
}

export const RecycleBin: FC<RecycleBinProps> = ({ room }) => {
  const [trash, setTrash] = useState<TrashedField[]>([]);
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => room.observeBin("recycle-bin", setTrash), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (field: Field) => {
      room.resetField(field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const recycleBinStyles: { [n: string]: CSSProperties } = {
    target: {
      width: "100%",
      transform: isOver ? "translateY(-4px)" : "",
      transition: "transform 300ms ease",
      marginTop: "8px",
    },
    description: {
      marginBottom: "8px",
      height: "150px",
      overflowY: "auto",
    },
  };

  return (
    <>
      {showTrash ? (
        <div style={recycleBinStyles.description}>
          {trash.map((trashedField: TrashedField) => (
            <li
              key={trashedField.id}
              style={{ listStyle: "none", marginBottom: "8px" }}
            >
              <StudentComp field={trashedField} />
            </li>
          ))}
        </div>
      ) : (
        <p style={recycleBinStyles.description}>
          Zum <strong>Löschen</strong>, einen Sitzplatz in den Papierkorb
          schieben. <strong>Klick</strong> auf den Papierkorb zeigt, was bereits
          gelöscht wurde.
        </p>
      )}
      <button
        ref={drop}
        style={recycleBinStyles.target}
        onClick={() => setShowTrash((prevShow) => !prevShow)}
      >
        Papierkorb
      </button>
    </>
  );
};
