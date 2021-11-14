import {
  Position,
  Student,
  Field,
  TrashedField,
  PositionObserver,
} from "./Types";

export class Room {
  private room: { [id: Field["id"]]: Field } = {};
  private bin: TrashedField[] = [];

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

  private roomObservers: { id: string; action: PositionObserver<Field> }[] = [];
  private binObservers: {
    id: string;
    action: PositionObserver<TrashedField[]>;
  }[] = [];

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

  public observeBin(
    id: string,
    o: PositionObserver<TrashedField[]>
  ): () => void {
    this.binObservers.push({ id, action: o });

    this.emitUpdatedBin(this.bin);

    return (): void => {
      this.binObservers = this.binObservers.filter((t) => t.id !== id);
    };
  }

  public moveStudent(
    originId: Field["id"],
    destinationId: Field["id"],
    moveTable = false
  ): void {
    const destinationField = {
      ...this.room[destinationId],
    };

    this.room[destinationId] = {
      ...this.room[destinationId],
      student: this.room[originId].student,
      isTable: moveTable
        ? this.room[originId].isTable
        : this.room[destinationId].isTable,
    };

    this.room[originId] = {
      ...this.room[originId],
      student: destinationField?.student,
      isTable: moveTable
        ? destinationField.isTable
        : this.room[originId].isTable,
    };

    this.emitChange(this.room[originId]);
    this.emitChange(this.room[destinationId]);
  }

  public createTable(id: Field["id"]) {
    const field = { ...this.room[id], isTable: true };
    this.room[id] = { ...field };
    this.emitChange(field);
  }

  public assignNewStudent(name: string): void {
    const emptyField = this.findEmptyTable();

    if (emptyField) {
      const newField = {
        ...emptyField,
        student: {
          id: this.generateId(),
          name,
          position: emptyField.position,
        },
      };

      this.room[emptyField.id] = newField;
      this.emitChange(newField);
    } else {
    }
  }

  public resetField(field: Field): void {
    this.bin.unshift({ ...this.room[field.id], trashed: true });

    this.room[field.id] = {
      ...this.room[field.id],
      student: undefined,
      isTable: false,
    };

    this.emitChange(this.room[field.id]);
  }

  public restoreField(field: TrashedField, destinationId?: string): void {
    const id = destinationId || field.id;

    this.bin = this.bin.filter((trashedField) => trashedField.id !== field.id);

    this.room[id] = {
      id,
      isTable: field.isTable,
      student: field.student,
      position: this.room[id].position,
    };

    this.emitChange(this.room[id]);
    this.emitUpdatedBin(this.bin);
  }

  private findEmptyTable(): Field {
    const allFields = Object.values(this.room);
    const emptyTable = allFields.find(
      (firstField) => firstField.isTable && !firstField.student
    );
    if (emptyTable) {
      return emptyTable;
    } else {
      return allFields.find((firstField) => !firstField.student)!;
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

  private emitUpdatedBin(updatedBin: TrashedField[]) {
    this.binObservers.forEach((observer) => {
      observer.action && observer.action(updatedBin);
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
