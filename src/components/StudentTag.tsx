import { FC, useState, useEffect, SetStateAction, Dispatch } from "react";
import { controller } from "../lib/Controller";
import { Field } from "../lib/Model";

interface StudentTagProps {
  initialField: Field;
  onClickHandler: Dispatch<SetStateAction<Field | undefined>>;
}

export const StudentTag: FC<StudentTagProps> = ({
  initialField,
  onClickHandler,
}) => {
  const [field, setField] = useState<Field>(initialField);

  useEffect(() => {
    controller.observe(field.id, setField);
    return () => controller.removeObserver(field.id, setField);
  }, []);

  return field.student ? (
    <div
      style={{
        backgroundColor: "var(--color-primary-light",
        color: "white",
        borderRadius: "var(--space)",
        padding: "var(--space)",
        marginTop: "var(--space)",
        cursor: "pointer",
      }}
      onClick={() => onClickHandler(field)}
    >
      {field.student.name}
    </div>
  ) : null;
};
