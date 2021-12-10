import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import styles from "./App.module.css";
import { controller } from "./lib/Controller";
import { RecycleBin } from "./components/RecycleBin";

export default function App() {
  const [classroomKey, setClassroomKey] = useState(
    controller.getClassroomKey()
  );

  useEffect(
    () => controller.observeClassroomKey(setClassroomKey),
    [classroomKey]
  );
  return (
    <>
      <Menu />
      <DndProvider backend={HTML5Backend}>
        <div className={styles.layout}>
          <Controls />
          <Classroom key={classroomKey} />
        </div>
        <RecycleBin />
      </DndProvider>
    </>
  );
}
