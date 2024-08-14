// import our ejs-compiled template
import tmplContact from './contact.ejs';
// import my model
import ContactMessage from '../../models/ContactMessage.js';

// export a default function for the router to call
export default async (route) => 
{
    console.log(route);
    // do stuff to prepare this component before the template renders
    const { messages } = onInit();
    // render our template, give it our list of messages
    const strContact = tmplContact({ messages });
    // attach our template to the dom somewhere
    document.getElementById('app').innerHTML = strContact;
    // do the rest of the stuff needed to configure the template
    onRender();
}

/* 
 *  Stuff to do right before the template gets rendered
 *  Perhaps return stuff that the template might need to use
 */
function onInit() 
{
    // make sure storage is set up for messages
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
    // get a list of messages
    const messages = JSON.parse(localStorage.getItem('messages'));
    // i like to return an object here so it's easily changeable
    return { messages }
}

/* 
 *  Stuff to do right after the template gets rendered
 */
function onRender() 
{
    // get a reference to the form
    const formElement = document.getElementById('contact-form');
    // attach the event listener
    formElement.addEventListener('submit', formSubmitHandler);
}

/*
 *
 */
function formSubmitHandler (event) {
    // stop the default handler from executing
    event.preventDefault();
    // log out some values, event.target will be the actual form element
    console.log(`name: ${event.target.name.value}`);
    console.log(`phone: ${event.target.phone.value}`);
    console.log(`email: ${event.target.email.value}`);
    console.log(`message: ${event.target.message.value}`);
    /* 
     *  Should probably do some kind of input validation here
     */
    // create a new ContactMessage
    const message = new ContactMessage({
        name: event.target.name.value,
        phone: event.target.phone.value,
        email: event.target.email.value,
        message: event.target.message.value,
    })
    // get existing list of messages
    const store = JSON.parse(localStorage.getItem('messages'));
    // add this message to it
    store.push(message);
    // try to store it
    localStorage.setItem('messages', JSON.stringify(store));
}
