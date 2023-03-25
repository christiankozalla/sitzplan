import { FormEventHandler, FC, useState, useEffect } from "react";
import { backend } from "../lib/Backend";
import type { User } from "../lib/Model";
import { controller } from "../App";
import styles from "./Menu.module.css";

export const Menu: FC = () => {
  const [showForm, setShowForm] = useState<null | "login" | "signup">(null);
  const [showMenu, setShowMenu] = useState(false);
  const [roomName, setRoomName] = useState(controller.getRoomName());
  const [classGroupName, setClassGroupName] = useState(
    controller.getClassName()
  );
  const [rows, setRows] = useState(controller.getDimension("rows").toString());
  const [cols, setCols] = useState(controller.getDimension("cols").toString());

  useEffect(() => controller.observe("roomName", setRoomName), []);
  useEffect(() => controller.observe("className", setClassGroupName), []);
  useEffect(() => {
    controller.observe("rows", setRows);
    controller.observe("columns", setCols);
    document.documentElement.style.setProperty("--rows", `${rows}`);
    document.documentElement.style.setProperty("--columns", `${cols}`);
  }, [rows, cols]);

  const sendForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!showForm) return;
    const formData = new FormData(e.target as HTMLFormElement);
    // @ts-ignore
    const user = Object.fromEntries(formData.entries()) as User;
    if (showForm === "login") {
      backend.loginUser(user).then((user) => {
        console.log(user);
      });
    } else {
      backend.createUser(user).then((user) => {
        console.log(user);
      });
    }
  };

  return (
    <div className={styles.menu}>
      <div className={styles.firstLine}>
        <button
          className={styles.menuButton}
          aria-label="Menü"
          onClick={() => {
            setShowForm(null);
            setShowMenu((prevShow) => !prevShow);
          }}
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
          onChange={(e) =>
            controller.updateMetaData("roomName", e.target.value)
          }
        />
        <label htmlFor="className" className="screenReaderOnly">
          Name der Klasse
        </label>
        <input
          id="className"
          className={styles.input}
          value={classGroupName}
          placeholder="Klasse"
          type="text"
          onChange={(e) =>
            controller.updateMetaData("className", e.target.value)
          }
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
                onChange={(e) =>
                  controller.updateMetaData("rows", e.target.value)
                }
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
                onChange={(e) =>
                  controller.updateMetaData("columns", e.target.value)
                }
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </li>
            <li>
              {showForm ? (
                <form onSubmit={sendForm}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" />
                  <label htmlFor="password">Passwort</label>
                  <input type="password" id="password" name="password" />
                  <button type="submit">
                    {showForm && showForm === "login" ? "Login" : "Signup"}
                  </button>
                </form>
              ) : (
                <>
                  <button
                    className="secondary"
                    onClick={() => setShowForm("login")}
                  >
                    Login
                  </button>
                  <button onClick={() => setShowForm("signup")}>Signup</button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
