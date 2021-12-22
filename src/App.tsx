import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import { RecycleBin } from "./components/RecycleBin";
import { Controller, getInitialDataFromUrl } from "./lib/Controller";
import styles from "./App.module.css";

export const controller: Controller = getInitialDataFromUrl();

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
      <Menu key={classroomKey} />
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
