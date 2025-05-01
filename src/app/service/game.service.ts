import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private gameMap: { [key: string]: { name: string, image: string, genre: string } } = {
        balatro: { name: "Balatro", image: 'assets/img/Balatro.jpg', genre: 'Cartes' },
        cs2: { name: "Counter Strike 2", image: 'assets/img/CS2.png', genre: 'FPS/TPS' },
        fifa: { name: "Fifa 24", image: 'assets/img/fifa.png', genre: 'Sport' },
        lol: { name: "League of Legends", image: 'assets/img/LoL.png', genre: 'MOBA' },
        rocketleague: { name: "Rocket League", image: 'assets/img/rocketLeague.png', genre: 'Sport' },
        starcraft2: { name: "Star Craft 2", image: 'assets/img/starcraft2.png', genre: 'RTS' },
        supermeatboy: { name: "Super Meat Boy", image: 'assets/img/supermeatboy.jpg', genre: 'Plateforme' },
        valorant: { name: "Valorant", image: 'assets/img/valorant.png', genre: 'FPS/TPS' },
        pubg: { name: "PUBG", image: 'assets/img/pubg.jpg', genre: 'FPS/TPS' },
    };

    getAllGames() {
        return this.gameMap;
    }

    getGame(key: string) {
        return this.gameMap[key.toLowerCase()];
    }

    getGameImage(key: string): string {
        return this.gameMap[key.toLowerCase()]?.image;
    }
    

    getGenre(key: string): string {
        return this.gameMap[key.toLowerCase()]?.genre || '';
    }

    getGameKeyFromTitle(title: string): string {
        const allGames = this.getAllGames();
        const match = Object.entries(allGames).find(([key, data]) => data.name.toLowerCase() === title.toLowerCase());
        return match?.[0] || title.toLowerCase();
    }

    getGameFullName(key: string): string {
        return this.gameMap[key.toLowerCase()]?.name || key;
    }
    
}
