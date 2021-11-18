import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { ClassroomSidebar } from "./components/ClassroomSidebar";
import { ClassroomEditor } from "./components/ClassroomEditor";
import { Room } from "./lib/Room";
import { students, dimensions } from "./data.json";
import { Student } from "./lib/Types";
import styles from "./App.module.css";

export default function App() {
  const room = useMemo(() => new Room(students as Student[], dimensions), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.grid}>
        <div id={styles.editor}>
          <ClassroomEditor room={room} />
        </div>
        <div id={styles.board}>
          <Classroom room={room} />
        </div>
        <div id={styles.sidebar}>
          <ClassroomSidebar room={room} />
        </div>
      </div>
    </DndProvider>
  );
}
