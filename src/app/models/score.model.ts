export interface Score {
    id: number;
    user_id: number;
    event_id: number;
    score: number;
    recorded_at: string;
    position?: number;
    result?: 'win' | 'lose';
    metadata?: any;
    username?: string;
}