import tmplHeader from './header.ejs';

export default async () => {
    const strHeader = tmplHeader();
    
    // Insert header at the beginning of the #app div
    document.getElementById('app')
        .insertAdjacentHTML("beforebegin", strHeader);// innerHtml instead of insertAdjacentHTML
};
