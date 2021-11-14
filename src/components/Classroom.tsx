import { FC, CSSProperties } from "react";
import { Square } from "./Square";
import { ClassroomEditor } from "./ClassroomEditor";
import { Room } from "../lib/Room";

export interface ClassroomProps {
  room: Room;
}

const boardStyles: CSSProperties = {
  width: "75%",
  height: "100%",
  display: "flex",
  flexWrap: "wrap",
};

export const Classroom: FC<ClassroomProps> = ({ room }) => {
  const numberOfSquares = 100;
  const rootNumberOfSquares = Math.sqrt(numberOfSquares);
  const squareStyles: CSSProperties = {
    width: `${rootNumberOfSquares}%`,
    height: `${rootNumberOfSquares}%`,
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={boardStyles}>
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
