import type { FieldWithTable, FieldWithStudent } from "../src/lib/Model";
import arrange from "../src/lib/Arrange";
import { mockFields } from "./fields.mock";

test("Empty students array returns input tables", () => {
  // arrange
  const tables = [
    { id: "abc", isTable: true, student: undefined, position: [0, 0] },
    { id: "def", isTable: true, student: undefined, position: [4, 2] },
  ] as FieldWithTable[];

  // act
  const result = arrange(tables, []); // TypeScript prevents passing undefined, etc...

  // assert
  expect(result).toEqual(tables);
});

test("Returns as many students as were input", () => {
  // arrange
  const tables = mockFields.filter(
    (field) => field.isTable
  ) as FieldWithTable[];
  //.map((field) => new Field(field)) as FieldWithTable[];
  const students = mockFields.filter(
    (field) => field.student !== undefined
  ) as FieldWithStudent[];
  //.map((field) => new Field(field)) as FieldWithStudent[];

  // act
  const result = arrange(tables, students);

  // assert
  expect(students.length).toBeLessThanOrEqual(tables.length); // arrange should probably check for that...
  expect(result.length).toEqual(tables.length);
});
