export class Event {
    id: number = 0;
    title: string = "";
    description: string = "";
    date_time: string = "";
    max_players: number = 0;
    organizer_id: number = 0;
    state: string = "";
    images: string = "";
    duration: number = 0;
    nb_participants: number = 0;
    participants: { id: number; username: string }[] = [];
}
