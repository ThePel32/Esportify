export interface Participant {
    id: number;
    username: string;
    has_joined?: boolean;
}

export interface Event {
    id: number ;
    title: string;
    description: string;
    date_time: string;
    max_players: number;
    organizer_id: number;
    organizer_name: string;
    isFavorite?: boolean
    state: string;
    images: string;
    duration: number;
    nb_participants: number;
    participants: { id: number; username: string; has_joined?: boolean }[];
    started?: boolean;
    isBanned?: boolean;
}