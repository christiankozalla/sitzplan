import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import styles from "./App.module.css";
import { room } from "./lib/Room";

export default function App() {
  const [classroomKey, setClassroomKey] = useState(room.getClassroomKey());

  useEffect(() => room.observeClassroomKey(setClassroomKey), [classroomKey]);
  return (
    <>
      <Menu />
      <DndProvider backend={HTML5Backend}>
        <div className={styles.layout}>
          <Controls />
          <Classroom key={classroomKey} />
        </div>
      </DndProvider>
    </>
  );
}
