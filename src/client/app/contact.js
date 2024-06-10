// Import the saveMessage function from contact.mock.service.js
import { saveMessage } from './contact.mock.service.js';

// Get the form element by its ID
const form = document.getElementById('contact-form');

// Validate contact-form.
function validateContactForm(form) {
    let valid = true;

    const name = form.name.value.trim();
    const eleNameError = document.getElementById('name-error');

    if (name === "") {
        valid = false;
        eleNameError.classList.remove('d-none');
        eleNameError.textContent = "You must enter your name.";
    } else {
        eleNameError.classList.add('d-none');
    }

    const phone = form.phone.value.trim();
    const elePhoneError = document.getElementById('phone-error');

    if (phone === "") {
        valid = false;
        elePhoneError.classList.remove('d-none');
        elePhoneError.textContent = "You must enter your phone number.";
    } else {
        elePhoneError.classList.add('d-none');
    }

    const email = form.email.value.trim();
    const eleEmailError = document.getElementById('email-error');

    if (email === "") {
        valid = false;
        eleEmailError.classList.remove('d-none');
        eleEmailError.textContent = "You must enter your email address.";
    } else {
        eleEmailError.classList.add('d-none');
    }

    const message = form.message.value.trim();
    const elemessageError = document.getElementById('message-error');

    if (message === "") {
        valid = false;
        elemessageError.classList.remove('d-none');
        elemessageError.textContent = "You must enter the message.";
    } else {
        elemessageError.classList.add('d-none');
    }

    return valid;
}

// Function to handle the form submission event
const formEventHandler = (event) =>{
    event.preventDefault();

    // Get the form values from the event target (the form element)
    const formValues = event.target;
    const valid = validateContactForm(formValues); // Corrected function call

    if (valid) {
        const message = {
            name: formValues.name.value.trim(),
            phone: formValues.phone.value.trim(),
            email: formValues.email.value.trim(),
            message: formValues.message.value.trim(),   
        }
        // Save the message to local storage
        if (saveMessage(message)) {
            // Reset the form fields
            form.reset();
            console.log("Message saved successfully!");
        }
    }
}

// Add an event listener to the form to handle the 'submit' event
document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', formEventHandler);
});
