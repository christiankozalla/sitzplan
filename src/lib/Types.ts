import { Dispatch, SetStateAction } from "react";

export type Dimensions = { squaresPerRow: number; squaresPerColumn: number };

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

export type Trashed = {
  trashed: boolean;
};

export type TrashedField = Field & Trashed;

export type PositionObserver<T> = Dispatch<SetStateAction<T>> | null;
