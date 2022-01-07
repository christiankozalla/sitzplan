import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import { Modal } from "./components/Modal";
import { RecycleBin } from "./components/RecycleBin";
import { Controller, getInitialDataFromUrl } from "./lib/Controller";
import styles from "./App.module.css";
import { StudentEditor } from "./components/StudentEditor";

// Disable Contextmenu on right-click globally
// because right-click on a Student opens a Modal with StudentEditor
window.addEventListener("contextmenu", (e) => e.preventDefault());

export const controller: Controller = getInitialDataFromUrl();

export default function App() {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    field: undefined,
  });
  const [classroomKey, setClassroomKey] = useState(
    controller.getClassroomKey()
  );

  useEffect(() => {
    controller.observeClassroomKey(setClassroomKey);
    controller.observe("appModal", setModalConfig);

    return () => controller.removeObserver("appModal", setModalConfig);
  }, [classroomKey]);

  const handleModalOpen = (isOpen: boolean | ((prevOpen: boolean) => void)) => {
    if (typeof isOpen === "boolean" && isOpen === false) {
      return setModalConfig({ isOpen, field: undefined });
    } else if (typeof isOpen === "function") {
      return isOpen(modalConfig.isOpen);
    }
  };

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
      <Modal
        isOpen={modalConfig.isOpen}
        setOpen={handleModalOpen}
        title="Editor"
      >
        {modalConfig.field && <StudentEditor field={modalConfig.field} />}
      </Modal>
    </>
  );
}
