import type { Field, FieldWithTable, FieldWithStudent } from "./Model";
import { TryLimit } from "./Constants";

export default function sort(
  tables: FieldWithTable[],
  students: FieldWithStudent[]
): Field[] {
  if (!students.length) {
    return tables;
  }
  const studentStore = [...students];
  let currentIndex = 0;
  let tries = 0;
  const sorted: Field[] = []; // Result

  do {
    const currentTable = tables[currentIndex];
    const prevField = sorted.length ? sorted[sorted.length - 1] : undefined;
    const randIndex = studentStore.length
      ? randomIndex(studentStore.length)
      : -1;
    const { student } =
      randIndex > -1 ? studentStore[randIndex] : { student: undefined };

    if (
      student === undefined || // all students already placed
      (prevField?.student &&
        (prevField.student.forbiddenNeighbors.includes(student.name) || // a pair of students ain't allowed to sit next each other
          student.forbiddenNeighbors.includes(prevField.student.name)))
    ) {
      if (tries < TryLimit) {
        tries = tries + 1; // continue with a new random student
      } else {
        // students are forbidden, tried {TryLimit} different random students
        sorted.push(currentTable); // push empty table
        currentIndex = currentIndex + 1;
        tries = 0;
      }
    } else {
      // students are allowed
      currentTable.student = { ...student };
      sorted.push(currentTable);
      studentStore.splice(randIndex, 1);
      currentIndex = currentIndex + 1;
    }
  } while (sorted.length < tables.length || studentStore.length > 0);

  // TODO
  // Edge case: currentIndex points to the end of tables, but there are students left to place
  // in this case, the loop would never end, because studentStore.length would stay > 0
  // workaround: check if (currentIndex > tables.length - 1)
  // then grab all empty tables from sorted, and invoke sort(emptyTables, remainingStudents)

  return sorted;
}

export function randomIndex(length: number): number {
  return Math.floor(Math.random() * (length - 1));
}
