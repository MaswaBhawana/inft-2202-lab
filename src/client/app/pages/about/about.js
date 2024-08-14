import tmplAbout from './about.ejs';
//import '../../../img/profile1.jpg';

export default async () => {
    const strAbout = tmplAbout();

    const container = document.getElementById('app');
    container.innerHTML = '';  // Clear the previous content
    container.insertAdjacentHTML("afterbegin", strAbout);  // Insert the new content
}
