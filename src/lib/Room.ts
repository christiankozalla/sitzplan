import { Position, Student } from "./Types";
import { Dispatch, SetStateAction } from "react";

export type PositionObserver<T> = Dispatch<SetStateAction<T>> | null;
export type ObserverTypes = "students" | "tables";

export class Room {
  public tables: Position[] = [];
  constructor(public students: Student[] = []) {
    this.students = students;
  }

  private studentObservers: PositionObserver<Student[]>[] = [];
  private tableObservers: PositionObserver<Position[]>[] = [];

  public generateTablePreset(rows: number, numberOfTables: number = 24): void {
    const width = Math.ceil(numberOfTables / rows);

    const offsetX = 10 - width;
    const offsetY = Math.ceil((10 - rows) / (3 * rows));

    let x = 0 + offsetX;
    let y = 0 + offsetY;

    for (let i = 0; i < numberOfTables; i++) {
      this.tables.push([x, y]);
      this.emitChange([x, y]);
      x++;

      if (x === width) {
        x = 0 + offsetX;
        y += 2;
      }
    }
  }

  public observeStudents(o: PositionObserver<Student[]>): () => void {
    this.studentObservers.push(o);

    return (): void => {
      this.studentObservers = this.studentObservers.filter((t) => t !== o);
    };
  }

  public observeTables(o: PositionObserver<Position[]>): () => void {
    this.tableObservers.push(o);

    return (): void => {
      this.tableObservers = this.tableObservers.filter((t) => t !== o);
    };
  }

  public moveStudent(student: Student, toX: number, toY: number): void {
    this.emitChange([toX, toY], student);
  }

  public moveTable(toX: number, toY: number): void {
    this.emitChange([toX, toY]);
  }

  private emitChange(newPosition: Position, student?: Student): void {
    if (student) {
      this.students = this.students.filter(({ id }) => id !== student.id);
      this.students.push({ ...student, position: newPosition });

      this.studentObservers.forEach((o) => {
        if (typeof o === "function") {
          o(this.students);
        }
      });
    } else {
      this.tableObservers.forEach((o) => {
        if (typeof o === "function") {
          o((prevState: Position[]) => [...prevState, newPosition]);
        }
      });
    }
  }
}
