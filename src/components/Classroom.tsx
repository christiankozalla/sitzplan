import { FC, CSSProperties } from "react";
import { squaresPerRow, squaresPerColumn } from "../lib/Constants";
import { Square } from "./Square";
import { ClassroomEditor } from "./ClassroomEditor";
import { Room } from "../lib/Room";
import "../styles/classroom.css";

export interface ClassroomProps {
  room: Room;
}

export const Classroom: FC<ClassroomProps> = ({ room }) => {
  const squareStyles: CSSProperties = {
    width: `${100 / squaresPerRow}%`,
    height: `${100 / squaresPerColumn}%`,
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div className="classroom__board">
        {Object.values(room.getFields()).map((field) => {
          return (
            <div key={field.id} style={squareStyles}>
              <Square initialField={field} room={room} />
            </div>
          );
        })}
      </div>
      <ClassroomEditor room={room} />
    </div>
  );
};
