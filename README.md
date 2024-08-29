# Modern Chat App

Little chat app SPA written on React with the use of Firebase service

## Features

### Login page

- When not authenticated login page displays the Log In or Sign Up options;
- To Log In user must enter registered email and a valid password;
- To Sign Up user must enter a valid email, unique username, password and avatar;

### Main page

- Main chat page is divided to three columns: Chat list, main chat section, details section;
- Chat list section contains the main user info, search bar and the list of available chats;
- Search bar features an input to filter out the current chat list and Add User button;
- Add user modal lets user to search other users and start chat with them;
- Center section shows the currently selected chat with the info of the interlocutor;
- Current chat allows to send and receive text/emojis as well as a emojis;
- Right section lists chat's details including some settings, images, and some buttons;
- Image part shows all images that were sent in the chat with the option to download them individually;
- Right section buttons are for logging out and blocking user, disabling the option to chat with him;

## Details

- Signing Up and Logging In are handled via Firebase service;
- Data fetching is handled via Firebase service;
- All the data is stored in the Firestore database;
- Styles are handled via Vanilla CSS with BEM;
- Notifications are handled via Toastify library;
- State management is handled via Zustand;
- A big number of improvements were added to the layout and some logic of the original project;
- Responsive design supporting mobile devices with a width of at least 1200px;

### Live version

https://vsbron-react2024-modern-chat-app.netlify.app/
