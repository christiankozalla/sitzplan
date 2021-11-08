import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Classroom } from "./components/Classroom";
import { Room } from "./lib/Room";
import { students, fields } from "./data.json";
import { Student, Position } from "./lib/Types";

export default function App() {
  // const room = useMemo(
  //   () => new Room(fields as Position[], students as Student[]),
  //   []
  // );

  const room = new Room(fields as Position[], students as Student[]);

  return (
    <div style={{ maxWidth: "900px", margin: "1rem auto" }}>
      <DndProvider backend={HTML5Backend}>
        <Classroom room={room} />
      </DndProvider>
    </div>
  );
}
