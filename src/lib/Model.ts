import { Dispatch, SetStateAction } from "react";

export type Dimensions = { columns: number; rows: number };

export type Position = [number, number];

export type Student = {
  id: string;
  name: string;
};

export type Trashed = {
  trashed: boolean;
};

export type MetaKeys = "roomName" | "className" | "columns" | "rows";
export type TrashedField = Field & Trashed;
export type PositionObserver<T> = Dispatch<SetStateAction<T>> | null;

type FieldProps = {
  id: string;
  position: Position;
  isTable: boolean;
  student: Student | undefined;
};

export class Field {
  id: string;
  position: Position;
  isTable: boolean;
  student: Student | undefined;

  constructor({ id, position, isTable, student }: FieldProps) {
    this.id = id;
    this.position = position;
    this.isTable = isTable;
    this.student = student;
  }
}
