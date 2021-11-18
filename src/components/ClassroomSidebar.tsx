import { FC } from "react";
import { Room } from "../lib/Room";
import { RecycleBin } from "./RecycleBin";
import "./ClassroomSidebar.css";

interface ClassroomSidebarProps {
  room: Room;
}

export const ClassroomSidebar: FC<ClassroomSidebarProps> = ({ room }) => {
  return (
    <section className="sidebar">
      <h2>Details</h2>
      <RecycleBin room={room} />
    </section>
  );
};
