import { FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { Room } from "../lib/Room";
import { Field, TrashedField } from "../lib/Types";
import { StudentComp } from "./Student";
import "./RecycleBin.css";

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

  return (
    <>
      {showTrash ? (
        <div className="description">
          {trash.map((trashedField: TrashedField) => (
            <li key={trashedField.id} className="list">
              <StudentComp field={trashedField} />
            </li>
          ))}
        </div>
      ) : (
        <p className="description">
          Zum <strong>Löschen</strong>, einen Sitzplatz in den Papierkorb
          schieben. <strong>Klick</strong> auf den Papierkorb zeigt, was bereits
          gelöscht wurde.
        </p>
      )}
      <button
        ref={drop}
        className="target"
        style={{ transform: isOver ? "translateY(-4px)" : "" }}
        onClick={() => setShowTrash((prevShow) => !prevShow)}
      >
        Papierkorb
      </button>
    </>
  );
};
