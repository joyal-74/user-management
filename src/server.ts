import express from 'express';
import studentRoutes from './routes/student.routes';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import { connectDB } from './utils/connect';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', path.join(__dirname, 'views/layout/layout.ejs'));

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '../assets/uploads')));

connectDB();

app.use(
    session({
        secret: 'lift-secret-cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 10,
        },
    })
);

app.use('/', studentRoutes);


app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/login');
});
