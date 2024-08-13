// Function to get the list of messages from local storage
export function getMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
}

// Function to save a message to local storage
export function saveMessage(message) {
    // Get a list of messages
    const messages = getMessages();

    // Check if a message with the same email already exists
    if (messages.find(m => m.email === message.email)) {
        // Alert the user if the message already exists
        alert("A message with this email already exists.");
        return false;
    }

    // Add the new message to the list
    messages.push(message);

    // Save the updated list back to local storage
    localStorage.setItem('messages', JSON.stringify(messages));

    // Indicate the message was successfully saved
    return true;
}
