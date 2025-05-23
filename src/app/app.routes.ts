import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventsComponent } from './pages/events/events.component';
import { HomeComponent } from './pages/home/home.component';
import { UserSpaceComponent } from './pages/user-space/user-space.component';
import { UserHistoricComponent } from './pages/user-historic/user-historic.component';
import { AuthGuard } from './guard/auth.guard';
import { AddEventComponent } from './components/add-event/add-event.component';
import { EventRoomComponent } from './components/events-room/event-room.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch:'full'
    }, 
    {
        path: 'connexion',
        component: LoginComponent
    }, 
    {
        path: 'contact',
        component: ContactComponent
    }, 
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'space',
        component: UserSpaceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'historic',
        component: UserHistoricComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'add-event',
        component: AddEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'events/:id',
        component: EventRoomComponent,
        canActivate: [AuthGuard]
    }
];
