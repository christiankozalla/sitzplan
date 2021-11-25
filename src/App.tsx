import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import styles from "./App.module.css";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.layout}>
        <Controls />
        <div className={styles.room}>
          <Classroom />
        </div>
      </div>
    </DndProvider>
  );
}
