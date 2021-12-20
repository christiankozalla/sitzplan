import {
  Dimensions,
  TrashedField,
  PositionObserver,
  MetaKeys,
  Field,
  Student,
} from "./Model";

export class Controller {
  private room: { [id: Field["id"]]: Field } = {};
  private bin: TrashedField[] = [];
  private classroomKey: string;

  private rows = 10;
  private columns = 10;

  private roomName = "";
  private className = "";

  constructor(
    fieldsData: Field[] = [],
    dimensions: Dimensions = { columns: 10, rows: 10 }
  ) {
    const { columns, rows } = dimensions;
    const data = this.generateRoom(rows, columns, fieldsData);

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

  public getRoomName() {
    return this.roomName;
  }

  public getClassName() {
    return this.className;
  }

  public getDimension(direction: "rows" | "cols"): number {
    return direction === "rows" ? this.rows : this.columns;
  }

  private generateRoom(
    rows: number,
    cols: number,
    fieldsData: Field[]
  ): Field[] {
    const fields: Field[] = [];

    // An existing room can be regenerated with a different number of rows or columns
    // Here existing data is moved to newly created fields
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const field = fieldsData.find(
          ({ position: [fieldX, fieldY] }) => fieldX === x && fieldY === y
        );

        fields.push(
          new Field({
            id: this.generateId(),
            position: [x, y],
            isTable: field?.isTable || false,
            student: field?.student,
          })
        );
      }
    }

    return fields;
  }

  private roomObservers: {
    id: string;
    updateUi: PositionObserver<any>[];
  }[] = [];
  private classroomObserver: PositionObserver<string> | undefined;

  public observeClassroomKey(o: PositionObserver<string>) {
    this.classroomObserver = o;
  }

  private generateId() {
    return "_" + (Math.random() * 30).toString(36).slice(4, 16);
  }

  public getFields() {
    return Object.values(this.room);
  }

  public getFieldById(id: Field["id"]): Field {
    return this.room[id];
  }

  public setStudent(id: Field["id"], newStudent: Partial<Student>) {
    const field = this.room[id];

    if (field.student) {
      const newField = {
        ...field,
        student: {
          ...field.student,
          ...newStudent,
        },
      };

      this.room[id] = newField;
      this.emitChange(id, this.room[id]);
    }
  }

  public observe(
    id: string,
    setStateAction: PositionObserver<any>
  ): () => void {
    const existingIndex = this.roomObservers.findIndex(
      (observer) => observer.id === id
    );

    if (existingIndex > -1) {
      this.roomObservers[existingIndex] = {
        id,
        updateUi: [
          ...this.roomObservers[existingIndex].updateUi,
          setStateAction,
        ],
      };
    } else {
      this.roomObservers.push({ id, updateUi: [setStateAction] });
    }

    return (): void => {
      this.roomObservers = this.roomObservers.filter((t) => t.id !== id);
    };
  }

  public removeObserver(id: string, setStateAction: PositionObserver<any>) {
    this.roomObservers.forEach((observer) => {
      if (observer.id === id) {
        observer.updateUi = observer.updateUi.filter(
          (updateAction) => updateAction !== setStateAction
        );
      }
    });
  }

  // MetaData are the name of the class and room, and number of rows and columns
  public updateMetaData(id: MetaKeys, newValue: string) {
    if (id === "className" || id === "roomName") {
      this[id] = newValue;
    } else {
      // regenerate the whole room and update the classroomKey to trigger re-render
      const fieldsWithStudentsAndTables = Object.values(this.room).filter(
        (field) => field.student || field.isTable
      ) as Field[];

      // Number of rows is updated
      if (id === "rows") {
        const newRows = Number(newValue);

        const newFields = this.generateRoom(
          newRows,
          this["columns"],
          fieldsWithStudentsAndTables
        );
        this.room = {};

        for (const field of newFields) {
          this.room[field.id] = field;
        }
        this.updateClassroom();

        // Number of columns is updated
      } else if (id === "columns") {
        const newCols = Number(newValue);

        const newFields = this.generateRoom(
          this["rows"],
          newCols,
          fieldsWithStudentsAndTables
        );
        this.room = {};

        for (const field of newFields) {
          this.room[field.id] = field;
        }
        this.updateClassroom();
      }

      this[id] = Number(newValue);
    }
    this.emitChange(id, newValue);
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

    this.emitChange(originId, this.room[originId]);
    this.emitChange(destinationId, this.room[destinationId]);
  }

  public toggleTable(id: Field["id"]) {
    const field = { ...this.room[id], isTable: !this.room[id].isTable };
    this.room[id] = { ...field };
    this.emitChange(field.id, field);
  }

  public assignNewStudent(name: string): void {
    const emptyField = this.findEmptyTable();

    if (emptyField) {
      const newField = new Field({
        ...emptyField,
        student: {
          id: this.generateId(),
          name,
          gender: undefined,
          forbiddenNeighbors: [],
          row: undefined,
        },
      });

      this.room[emptyField.id] = newField;
      this.emitChange(newField.id, newField);
    }
  }

  public resetField(field: Field): void {
    this.bin.unshift({ ...this.room[field.id], trashed: true });

    this.room[field.id] = {
      ...this.room[field.id],
      student: undefined,
      isTable: false,
    };

    this.emitChange(field.id, this.room[field.id]);
    this.emitChange("recycleBin", this.bin);
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

    this.emitChange(id, this.room[id]);
    this.emitChange("recycleBin", this.bin);
  }

  private findEmptyTable(): Field | undefined {
    const allFields = Object.values(this.room);
    const emptyTable = allFields.find(
      (firstField) => firstField.isTable && !firstField.student
    );
    if (emptyTable) {
      return emptyTable;
    } else {
      return allFields.find((firstField) => !firstField.student);
    }
  }

  private emitChange(
    id: string,
    updatedValue: Field | TrashedField[] | string
  ): void {
    this.roomObservers.forEach((observer) => {
      if (observer.id === id) {
        observer.updateUi.forEach((update) => {
          if (update) {
            update(updatedValue);
          }
        });
      }
    });
  }
}

export const controller = new Controller();
