import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { ClassroomSidebar } from "./components/ClassroomSidebar";
import { ClassroomEditor } from "./components/ClassroomEditor";
import { Room } from "./lib/Room";
import { students, dimensions } from "./data.json";
import { Student } from "./lib/Types";
import "./App.css";

export default function App() {
  const room = useMemo(() => new Room(students as Student[], dimensions), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid">
        <div id="editor">
          <ClassroomEditor room={room} />
        </div>
        <div id="board">
          <Classroom room={room} />
        </div>
        <div id="sidebar">
          <ClassroomSidebar room={room} />
        </div>
      </div>
    </DndProvider>
  );
}
