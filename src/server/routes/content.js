import express from 'express';

const router = express.Router();

router.get('/', (request, response, next) => {
    response.status(200).send('main page of the application');
});

router.get('/about', (request, response, next) => {
    response.status(200).send('About page');
});

router.get('/contact', (request, response, next) => {
    response.status(200).send('Contact page');
});


export { router };

