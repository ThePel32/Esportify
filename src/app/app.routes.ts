import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventsComponent } from './pages/events/events.component';
import { HomeComponent } from './pages/home/home.component';

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
];
