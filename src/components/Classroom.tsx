import { FC, useEffect } from "react";
import { Square } from "./Square";
import { room } from "../lib/Room";
import styles from "./Classroom.module.css";

export const Classroom: FC = () => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--columns",
      `${room.getDimension("cols")}`
    );
    document.documentElement.style.setProperty(
      "--rows",
      `${room.getDimension("rows")}`
    );
  });

  return (
    <div className={styles.board}>
      {Object.values(room.getFields()).map((field) => {
        return (
          <div key={field.id} className={styles.square}>
            <Square initialField={field} />
          </div>
        );
      })}
    </div>
  );
};
