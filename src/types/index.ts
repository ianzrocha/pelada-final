export interface Participant {
  id?: number;
  name: string;
  fantasy_name?: string;
  birth_date?: string;
  type: 'Mensalista' | 'Diarista';
  position: 'Jogador' | 'Goleiro' | 'Juiz';
  active: boolean;
  offensive_rating: number; // 1-5
  defensive_rating: number; // 1-5
  speed_rating: number; // 1-5
  fouls: number;
  cards: number;
  goals: number;
  own_goals: number;
  matches_played: number;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id?: number;
  title: string;
  description?: string;
  match_date: string;
  games_count: number;
  status: 'pending' | 'in_progress' | 'finished';
  created_at?: string;
  updated_at?: string;
}

export interface MatchParticipant {
  id: number;
  match_id: number;
  participant_id: number;
  arrival_order?: number;
  team?: number;
  goals: number;
  own_goals: number;
  fouls: number;
  cards: number;
  name: string;
  position: 'Jogador' | 'Goleiro' | 'Juiz';
  offensive_rating: number;
  defensive_rating: number;
  speed_rating: number;
}

export interface MatchResult {
  id: number;
  match_id: number;
  game_number: number;
  team1_id?: number;
  team2_id?: number;
  team1_goals: number;
  team2_goals: number;
  status: 'pending' | 'in_progress' | 'finished';
  created_at?: string;
  updated_at?: string;
}
