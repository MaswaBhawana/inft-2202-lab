import tmplFooter from './footer.ejs';

export default async () => {
    const strFooter = tmplFooter();

    document.getElementById('app')
        .insertAdjacentHTML("afterbegin", strFooter);
}