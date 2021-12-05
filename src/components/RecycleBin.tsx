import { FC, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { controller } from "../lib/Controller";
import { Field, TrashedField } from "../lib/Model";
import { StudentComp } from "./Student";
import styles from "./RecycleBin.module.css";

export const RecycleBin: FC = () => {
  const [trash, setTrash] = useState<TrashedField[]>([]);

  useEffect(() => controller.observeBin("recycle-bin", setTrash), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (field: Field) => {
      controller.resetField(field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <>
      <div className={styles.description}>
        {trash.map(
          (trashedField: Field & Trashed) =>
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
