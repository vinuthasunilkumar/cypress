interface IColumnType<T> {
  key: string;
  width?: number;
  render?: (column: IColumnType<T>, item: T) => void;
}