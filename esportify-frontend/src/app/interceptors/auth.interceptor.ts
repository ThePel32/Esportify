import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

const isApi = (url: string) =>
    url.startsWith(environment.apiUrl ?? environment.apiBaseUrl);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const publicRoute = req.url.includes('/login') || req.url.includes('/signup') || req.url.includes('/refresh-token');

    if (token && isApi(req.url) && !publicRoute) {
        req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
    return next(req);
};
