import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { ClassroomSidebar } from "./components/ClassroomSidebar";
import { ClassroomEditor } from "./components/ClassroomEditor";
import styles from "./App.module.css";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.grid}>
        <div id={styles.editor}>
          <ClassroomEditor />
        </div>
        <div id={styles.board}>
          <Classroom />
        </div>
        <div id={styles.sidebar}>
          <ClassroomSidebar />
        </div>
      </div>
    </DndProvider>
  );
}
