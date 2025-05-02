import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    const isPublicRoute = req.url.includes('/signup') || req.url.includes('/login');

    if (token && !isPublicRoute) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }
    return next(req);
};