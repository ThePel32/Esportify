export interface Score {
    id: number;
    user_id: number;
    event_id: number;
    recorded_at: string;
    score: number;
    position?: number;
    result?: 'win' | 'lose';
    metadata?: any;
    username?: string;
}