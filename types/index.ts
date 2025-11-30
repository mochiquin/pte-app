export type QuestionType = 'RA' | 'RS' | 'DI' | 'RL' | 'ASQ' | 'SWT' | 'WE' | 'R_FIB' | 'R_W_FIB' | 'RO' | 'SST' | 'L_FIB' | 'HCS' | 'SMW' | 'HIW' | 'WFD';

export interface Question {
  id: string;
  type: QuestionType;
  title: string | null;
  content: string | null;
  audio_url: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string | null;
  audio_url: string | null;
  transcript: string | null;
  score: any | null; // using any for JSONB for now, can be refined
  created_at: string;
}

