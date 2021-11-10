import { Position, Student, Field, PositionObserver } from "./Types";

export class Room {
  private room: { [id: Field["id"]]: Field } = {};

  constructor(room: Position[] = [], students: Student[] = []) {
    const data = room.map((p) => ({
      id: this.generateId(),
      student: students.find(
        ({ position }) => position[0] === p[0] && position[1] === p[1]
      ),
      isTable: false,
      position: p,
    }));

    data.forEach((field) => {
      Object.assign(this.room, { [field.id]: field });
    });
  }

  public roomObservers: { id: string; action: PositionObserver<Field> }[] = [];

  private generateId() {
    return "_" + (Math.random() * 30).toString(36).slice(4, 16);
  }

  public getFields() {
    return this.room;
  }

  public observeRoom(id: string, o: PositionObserver<Field>): () => void {
    this.roomObservers.push({ id, action: o });

    return (): void => {
      this.roomObservers = this.roomObservers.filter((t) => t.id !== id);
    };
  }

  public moveStudent(originId: Field["id"], destinationId: Field["id"]): void {
    const destinationStudent = this.room[destinationId].student;

    if (this.room[originId].student) {
      this.room[destinationId] = {
        ...this.room[destinationId],
        student: this.room[originId].student,
      };

      this.room[originId] = {
        ...this.room[originId],
        student: destinationStudent,
      };
      this.emitChange(this.room[originId]);
      this.emitChange(this.room[destinationId]);
    }
  }

  private emitChange(updatedField: Field): void {
    const { id } = updatedField;

    this.roomObservers.forEach((observer) => {
      if (observer.id === id) {
        observer.action && observer.action(updatedField);
      }
    });
  }

  public generateTablePreset(rows: number, numberOfTables: number = 24): void {
    const width = Math.ceil(numberOfTables / rows);

    const offsetX = 10 - width;
    const offsetY = Math.ceil((10 - rows) / (3 * rows));

    let x = 0 + offsetX;
    let y = 0 + offsetY;

    for (let i = 0; i < numberOfTables; i++) {
      let field = Object.values(this.room).find(
        ({ position }) => position[0] === x && position[1] === y
      );

      if (field) {
        let newField = {
          ...field,
          isTable: true,
        };
        this.room[field.id] = newField;
        this.emitChange(newField);
      } else {
        throw new Error("Field not found");
      }

      x++;

      if (x === width) {
        x = 0 + offsetX;
        y += 2;
      }
    }
  }
}
