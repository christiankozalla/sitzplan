import { FC } from "react";
import { Square } from "./Square";
import { Room } from "../lib/Room";
import "./Classroom.css";

export interface ClassroomProps {
  room: Room;
}

export const Classroom: FC<ClassroomProps> = ({ room }) => {
  document.documentElement.style.setProperty(
    "--squaresPerRow",
    `${room.getDimension("row")}`
  );
  document.documentElement.style.setProperty(
    "--squaresPerColumn",
    `${room.getDimension("column")}`
  );

  return (
    <div className="board">
      {Object.values(room.getFields()).map((field) => {
        return (
          <div key={field.id} className="square">
            <Square initialField={field} room={room} />
          </div>
        );
      })}
    </div>
  );
};
