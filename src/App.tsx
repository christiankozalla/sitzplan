import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import { RecycleBin } from "./components/RecycleBin";
import { Controller } from "./lib/Controller";
import type { StorageData } from "./lib/Model";
import styles from "./App.module.css";

export let controller = new Controller();

export default function App() {
  const [classroomKey, setClassroomKey] = useState(
    controller.getClassroomKey()
  );

  useEffect(() => {
    const dataString: string | null = new URLSearchParams(location.search).get(
      "state"
    );

    const data: StorageData | undefined = dataString
      ? JSON.parse(atob(decodeURIComponent(dataString)))
      : undefined;

    if (data) {
      controller = new Controller(
        data.className,
        data.roomName,
        data.rows,
        data.columns,
        data.fields
      );

      setClassroomKey(controller.getClassroomKey());
    }
  }, []);

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
