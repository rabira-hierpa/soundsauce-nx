type Todo = {
  title: string;
  completed: boolean;
  id: number;
  userId: number;
};
type IGraphData = {
  date: Date | null;
  Leq: number;
};

type LineChartProps = {
  data: IGraphData[];
  width: number;
  height: number;
};

type ICSVData = {
  data: IData[];
  errors: any;
  meata: IMeta;
};

type IData = {
  Address: string;
  'Start Time': string;
  'Measurement Time': string;
  Over: string;
  Under: string;
  LE: number;
  LN1: number;
  LN2: number;
  LN3: number;
  LN4: number;
  LN5: number;
  Leq: number;
  Lmax: number;
  Lmin: number;
  Ly: string;
};

type IMeta = {
  delimiter: string;
  linebreak: string;
  aborted: boolean;
  truncated: boolean;
  cursor: number;
  fields: string[];
};

export type { ICSVData, IData, IGraphData, IMeta, LineChartProps, Todo };
