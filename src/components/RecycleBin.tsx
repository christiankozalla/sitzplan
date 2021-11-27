import { FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { room } from "../lib/Room";
import { Field, TrashedField } from "../lib/Types";
import { StudentComp } from "./Student";
import styles from "./RecycleBin.module.css";

export const RecycleBin: FC = () => {
  const [trash, setTrash] = useState<TrashedField[]>([]);

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
      <div className={styles.description}>
        {trash.map(
          (trashedField: TrashedField) =>
            trashedField.student && (
              <li key={trashedField.id} className={styles.list}>
                <StudentComp field={trashedField} />
              </li>
            )
        )}
      </div>
      <button
        ref={drop}
        className={styles.target}
        style={{ transform: isOver ? "translateY(-4px)" : "" }}
      >
        Papierkorb
      </button>
    </>
  );
};
