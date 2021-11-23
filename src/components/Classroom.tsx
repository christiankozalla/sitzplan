import { FC } from "react";
import { Square } from "./Square";
import { room } from "../lib/Room";
import styles from "./Classroom.module.css";

export const Classroom: FC = () => {
  document.documentElement.style.setProperty(
    "--squaresPerRow",
    `${room.getDimension("row")}`
  );
  document.documentElement.style.setProperty(
    "--squaresPerColumn",
    `${room.getDimension("column")}`
  );

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
