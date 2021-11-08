import { Dispatch, SetStateAction } from "react";

export type Position = [number, number];

export type Student = {
  id: string;
  name: string;
  position: Position;
};

export type Field = {
  id: string;
  position: Position;
  isTable: boolean;
  student?: Student;
};

export type PositionObserver<T> = Dispatch<SetStateAction<T>> | null;
