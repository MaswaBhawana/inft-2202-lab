import Navigo from 'navigo';
import 'bootstrap';
import './scss/styles.scss';
//import './img/animal.jpg';
import '@fortawesome/fontawesome-free';

import HeaderComponent from './app/components/header/header.js';
import FooterComponent from './app/components/footer/footer.js';
import HomeComponent from './app/pages/home/home.js';
import AboutComponent from './app/pages/about/about.js';
import ContactComponent from './app/pages/contact/contact.js';
import CreateProductComponent from './app/pages/create-product/create-product.js';
import ListProductsComponent from './app/pages/list-products/list-products.js';

console.log("loaded javascript");


export const router = new Navigo('/');

window.addEventListener('load', () => {
    HeaderComponent();
    FooterComponent();


    router
        .on('/', HomeComponent)
        .on('/add', CreateProductComponent)
        .on('/list', ListProductsComponent)
        .on('/contact', ContactComponent)
        .on('/about', AboutComponent)
        .resolve();
    //HomeComponent();
    //AboutComponent();

    document.addEventListener('click', event => {
        if (event.target.attributes[['route']]) {
            event.preventDefault();
            router.navigate(event.target.attributes['route'].value);
        }
    })
});
