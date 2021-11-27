import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <Menu />
      <DndProvider backend={HTML5Backend}>
        <div className={styles.layout}>
          <Controls />
          <div className={styles.room}>
            <Classroom />
          </div>
        </div>
      </DndProvider>
    </>
  );
}
