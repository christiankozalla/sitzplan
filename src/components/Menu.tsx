import { FC, useState, useEffect } from "react";
import { room } from "../lib/Room";
import styles from "./Menu.module.css";

export const Menu: FC = () => {
  const [roomName, setRoomName] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => room.observeRoomMeta("roomName", setRoomName), []);
  useEffect(() => room.observeRoomMeta("className", setClassName), []);

  return (
    <div className={styles.wrapper}>
      <button className={styles.menuButton} aria-label="Menü"></button>
      <label htmlFor="roomName" className="screenReaderOnly">
        Name des Klassenraums
      </label>
      <input
        id="roomName"
        className={styles.input}
        value={roomName}
        placeholder="Raum"
        onChange={(e) => room.updateMeta("roomName", e.target.value)}
      />
      <label htmlFor="className" className="screenReaderOnly">
        Name der Klasse
      </label>
      <input
        id="className"
        className={styles.input}
        value={className}
        placeholder="Klasse"
        onChange={(e) => room.updateMeta("className", e.target.value)}
      />
    </div>
  );
};
