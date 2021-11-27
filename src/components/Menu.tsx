import { FC, useState, useEffect } from "react";
import { room } from "../lib/Room";
import styles from "./Menu.module.css";

export const Menu: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [className, setClassName] = useState("");
  const [rows, setRows] = useState(room.getDimension("rows").toString());
  const [cols, setCols] = useState(room.getDimension("cols").toString());

  useEffect(() => room.observeRoomMeta("roomName", setRoomName), []);
  useEffect(() => room.observeRoomMeta("className", setClassName), []);
  useEffect(() => {
    room.observeRoomMeta("rows", setRows);
    room.observeRoomMeta("columns", setCols);
    document.documentElement.style.setProperty("--rows", `${rows}`);
    document.documentElement.style.setProperty("--columns", `${cols}`);
  }, [rows, cols]);

  return (
    <div className={styles.menu}>
      <div className={styles.firstLine}>
        <button
          className={styles.menuButton}
          aria-label="Menü"
          onClick={() => setShowMenu((prevShow) => !prevShow)}
        ></button>
        <label htmlFor="roomName" className="screenReaderOnly">
          Name des Klassenraums
        </label>
        <input
          id="roomName"
          className={styles.input}
          value={roomName}
          placeholder="Raum"
          type="text"
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
          type="text"
          onChange={(e) => room.updateMeta("className", e.target.value)}
        />
      </div>
      {showMenu && (
        <div className={styles.expandedMenu}>
          <ul role="list">
            <li>
              <label htmlFor="rows">Anzahl der Reihen</label>{" "}
              <select
                name="rows"
                id="rows"
                value={rows}
                onChange={(e) => room.updateMeta("rows", e.target.value)}
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </li>
            <li>
              <label htmlFor="cols">Anzahl der Spalten</label>{" "}
              <select
                name="cols"
                id="cols"
                value={cols}
                onChange={(e) => room.updateMeta("columns", e.target.value)}
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
