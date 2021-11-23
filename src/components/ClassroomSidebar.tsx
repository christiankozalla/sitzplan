import { FC } from "react";
import { RecycleBin } from "./RecycleBin";
import styles from "./ClassroomSidebar.module.css";

export const ClassroomSidebar: FC = () => {
  return (
    <aside className={styles.sidebar}>
      <h2>Details</h2>
      <RecycleBin />
    </aside>
  );
};
