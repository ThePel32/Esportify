import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventsComponent } from './pages/events/events.component';

export const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch:'full'
}, {
    path: 'connexion',
    component: LoginComponent
}, {
    path: 'contact',
    component: ContactComponent
}, {
    path: 'Événements',
    component: EventsComponent
}];
