export type Cursor = {
  x?: number;
  y?: number;
  word?: string;
  link?: string;
  state?: string;
  debug?: string;
}

export type Line = {
  title?: string;
  render?: string;
  done?: boolean;
  description?: string;
  type?: string;
}
