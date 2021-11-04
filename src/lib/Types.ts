export type Position = [number, number];

export type Seat = {
  position: Position;
};

export type Student = {
  id: string;
  name: string;
  position: Position;
};
