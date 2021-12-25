import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  setOpen,
  action,
  children,
}) => {
  if (isOpen) {
    return (
      <div role="dialog" className={styles.dialog}>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          {action}
          <button onClick={() => setOpen(false)}>&times;</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
