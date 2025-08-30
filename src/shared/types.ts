export type Car = {
  id: number;
  name: string;
  color: string; // hex
};

export type EngineStartResponse = {
  velocity: number; // px/s equivalent unit from API
  distance: number; // track distance unit from API
};

export type Winner = {
  id: number; // carId
  wins: number;
  time: number; // in seconds
};

export type WinnerRow = Winner & {
  car: Pick<Car, 'name' | 'color'>;
};

export type SortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';
