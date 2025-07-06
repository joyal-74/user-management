import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.session?.student;
    if (!user) return res.redirect('/login');

    if (user.role === 'admin') return next();
    if (user.role === 'student') return res.redirect('/home');

    res.redirect('/login');
};


export const isStudent = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.session?.student;
    if (!user) return res.redirect('/login');

    if (user.role === 'student') return next();
    if (user.role === 'admin') return res.redirect('/students');

    res.redirect('/login');
};


export const isAlreadyLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.session.student;
    if (user) {
        if (user.role === 'student') {
            res.redirect('/home');
        } else if (user.role === 'admin') {
            res.redirect('/students');
        } else {
            res.redirect('/login');
        }
        return;
    }
    next();
};


