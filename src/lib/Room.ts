import {
  Position,
  Dimensions,
  Student,
  Field,
  TrashedField,
  PositionObserver,
  MetaKeys,
} from "./Types";
import { students, dimensions } from "../data.json";

export class Room {
  private room: { [id: Field["id"]]: Field } = {};
  private bin: TrashedField[] = [];
  private classroomKey: string;

  private rows: number = 10;
  private columns: number = 10;

  private roomName: string = "";
  private className: string = "";

  constructor(
    students: Student[] = [],
    dimensions: Dimensions = { columns: 10, rows: 10 }
  ) {
    const { columns, rows } = dimensions;
    const data = this.generateRoom(rows, columns, students);

    // TODO: Refactor data generation because it is frequently used in this.updateMeta()
    // when changing the number of columns and rows
    // const data = room.map((p, i) => ({
    //   id: this.generateId(),
    //   student: students.find(
    //     ({ position }) => position[0] === p[0] && position[1] === p[1]
    //   ),
    //   isTable: false,
    //   position: p,
    // }));

    data.forEach((field) => {
      Object.assign(this.room, { [field.id]: field });
    });

    this.rows = rows;
    this.columns = columns;
    this.classroomKey = this.generateId();
  }

  public getClassroomKey() {
    return this.classroomKey;
  }

  public getDimension(direction: "rows" | "cols"): number {
    return direction === "rows" ? this.rows : this.columns;
  }

  private generateRoom(
    rows: number,
    cols: number,
    students: Student[]
  ): Field[] {
    const fields: Field[] = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const student = students.find(
          ({ position }) => position[0] === x && position[1] === y
        );

        fields.push({
          id: student?.id || this.generateId(),
          isTable: false,
          student,
          position: [x, y],
        });
      }
    }

    return fields;
  }

  private roomObservers: { id: string; action: PositionObserver<Field> }[] = [];
  private binObservers: {
    id: string;
    action: PositionObserver<TrashedField[]>;
  }[] = [];
  private roomMetaObservers: {
    id: MetaKeys;
    action: PositionObserver<string>;
  }[] = [];
  private classroomObserver: PositionObserver<string> | undefined;

  public observeClassroomKey(o: PositionObserver<string>) {
    this.classroomObserver = o;
  }

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

  public observeRoomMeta(
    id: MetaKeys,
    o: PositionObserver<string>
  ): () => void {
    this.roomMetaObservers.push({ id, action: o });

    return (): void => {
      this.roomMetaObservers = this.roomMetaObservers.filter(
        (t) => t.id !== id
      );
    };
  }

  public updateMeta(id: MetaKeys, newValue: string) {
    if (id === "className" || id === "roomName") {
      this[id] = newValue;
    } else {
      // regenerate the whole room and update the classroomKey to trigger re-render
      const students = Object.values(this.room)
        .filter(
          (field) =>
            field.hasOwnProperty("student") && field.student !== undefined
        )
        .map((field) => field.student) as Student[];

      // Number of rows is updated
      if (id === "rows") {
        const newRows = Number(newValue);

        const newFields = this.generateRoom(newRows, this["columns"], students);
        this.room = {};

        for (let field of newFields) {
          this.room[field.id] = field;
        }
        this.updateClassroom();

        // Number of columns is updated
      } else if (id === "columns") {
        const newCols = Number(newValue);

        const newFields = this.generateRoom(this["rows"], newCols, students);
        this.room = {};

        for (let field of newFields) {
          this.room[field.id] = field;
        }
        this.updateClassroom();
      }

      this[id] = Number(newValue);
    }
    this.emitUpdatedRoomMeta(id, newValue);
  }

  private updateClassroom() {
    this.classroomKey = this.generateId();
    typeof this.classroomObserver === "function" &&
      this.classroomObserver(this.classroomKey);
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

  public toggleTable(id: Field["id"]) {
    const field = { ...this.room[id], isTable: !this.room[id].isTable };
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

  private emitUpdatedRoomMeta(id: MetaKeys, newName: string) {
    const observer = this.roomMetaObservers.find(
      (observer) => observer.id === id
    );

    if (observer && observer.action) {
      observer.action(newName);
    }
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

export const room = new Room(students as Student[], dimensions);
