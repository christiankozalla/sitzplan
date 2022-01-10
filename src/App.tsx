import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import { Modal } from "./components/Modal";
import { RecycleBin } from "./components/RecycleBin";
import { Conditions } from "./components/Conditions";
import { Controller, getInitialDataFromUrl } from "./lib/Controller";
import styles from "./App.module.css";
import { ModalConfig } from "./lib/Model";

// Disable Contextmenu on right-click globally - only in prod
// because right-click on a Student opens a Modal with StudentEditor
import.meta.env.PROD &&
  window.addEventListener("contextmenu", (e) => e.preventDefault());

export const controller: Controller = getInitialDataFromUrl();

export default function App() {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
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

  const handleModalOpen = (
    isOpen: boolean | ((prevOpen: boolean) => boolean)
  ) => {
    console.log(isOpen);
    if (typeof isOpen === "boolean") {
      return setModalConfig({ isOpen, field: undefined });
    } else if (typeof isOpen === "function") {
      const newOpen = isOpen(modalConfig.isOpen);
      setModalConfig({ isOpen: newOpen, field: undefined });
    }
  };

  return (
    <>
      <Menu key={classroomKey} />
      <DndProvider backend={HTML5Backend}>
        <div className={styles.layout}>
          <Controls handleModalOpen={handleModalOpen} />
          <Classroom key={classroomKey} />
        </div>
        <RecycleBin />
      </DndProvider>
      <Modal
        isOpen={modalConfig.isOpen}
        setOpen={handleModalOpen}
        title="Editor"
      >
        <Conditions
          setOpen={handleModalOpen}
          initialField={modalConfig.field}
        />
      </Modal>
    </>
  );
}
