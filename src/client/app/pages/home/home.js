import tmplHome from './home.ejs';
import logo from '../../../img/logo1.png';
import background from '../../../img/background1.jpg';

export default async () => {
    const { logoSrc, backgroundSrc } = onInit();

    const strHome = tmplHome({
        logoSrc,
        backgroundSrc
    });

    const container = document.getElementById('app');
    container.innerHTML = '';
    container.insertAdjacentHTML("afterbegin", strHome);

    onRender();
}

/* 
 *  Stuff to do right before the template gets rendered
 *  Prepare the data that the template needs to use
 */
function onInit() {
    // Prepare data needed for rendering, like image sources
    const logoSrc = logo;
    const backgroundSrc = background;

    return { logoSrc, backgroundSrc };
}

/* 
 *  Stuff to do right after the template gets rendered
 *  This function is useful if you need to attach event listeners, etc.
 */
function onRender() {
    // Example: Attaching an event listener if needed
    const exploreButton = document.querySelector('.btn-primary');
    exploreButton.addEventListener('click', () => {
        console.log('Explore Now button clicked!');
    });
}
