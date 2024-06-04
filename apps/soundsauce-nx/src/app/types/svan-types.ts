import { PapaError, PapaMeta } from './period-types';

export type SVANDATA = {
  ID: string;
  'DATE&TIME': string;
  'P1 (A, Fast) - LAFmax (SR) [dB]': string;
  'P1 (A_1, Fast) - LAFmin (SR) [dB]': string;
  'P1 (A_2, Lin) - LAeq (SR) [dB]': string;
  'P1 (A_3, Lin) - LAeq Ln (SR) [dB] - L90': string;
};
export type ProcessedSVANDATA = {
  ID: string;
  DATETIME: Date;
  LAFmax: number;
  LAFmin: number;
  LAeq: number;
  LAeqLn: number;
};
export type ParsedSvanData = {
  data: SVANDATA[];
  errors: PapaError[] | null;
  meta: PapaMeta;
};
