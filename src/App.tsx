import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Room } from "./lib/Room";
import { students } from "./data.json";
import { Student } from "./lib/Types";

export default function App() {
  const room = useMemo(() => new Room(students as Student[]), []);

  return (
    <div style={{ maxWidth: "700px", margin: "1rem auto" }}>
      <DndProvider backend={HTML5Backend}>
        <Classroom room={room} />
      </DndProvider>
    </div>
  );
}
