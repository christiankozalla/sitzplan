import { Position, Student } from "./Types";
import { Dispatch } from "react";

export type PositionObserver = Dispatch<Student[]> | null;

export class Room {
  constructor(public tables: Student[] = []) {
    this.tables = tables;
  }

  private observers: PositionObserver[] = [];

  public observe(o: PositionObserver): () => void {
    this.observers.push(o);

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  public moveStudent(student: Student, toX: number, toY: number): void {
    this.emitChange(student, [toX, toY]);
  }

  private emitChange(student: Student, newPosition: Position): void {
    this.tables = this.tables.filter(({ id }) => id !== student.id);
    this.tables.push({ ...student, position: newPosition });

    this.observers.forEach((o) => {
      if (typeof o === "function") {
        o(this.tables);
      }
    });
  }
}
