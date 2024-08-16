import tmplFooter from './footer.ejs';

export default async () => {
    const strFooter = tmplFooter();

    document.getElementById('app')
        .insertAdjacentHTML("afterend", strFooter);
}