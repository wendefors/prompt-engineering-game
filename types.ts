export type GamePhase = 
  | 'intro' 
  | 'bad-intro'
  | 'bad-role' 
  | 'bad-task' 
  | 'bad-context' 
  | 'fail-summary'
  | 'education' 
  | 'good-intro'
  | 'good-role' 
  | 'good-task' 
  | 'good-context' 
  | 'victory'
  | 'marketing';

export interface GameState {
  score: number;
  lives: number;
  phase: GamePhase;
}

export interface MarketingContent {
  title: string;
  subtitle: string;
  challenges: string[];
  solution: string[];
  benefits: string[];
  contact: string;
}
