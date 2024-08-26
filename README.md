# Modern Chat App

Little chat app SPA written on React with the use of Firebase service

## Features

### Login page

- When not authenticated login page is displayed with the options of Log In or Sign Up
- To Log In user must enter registered email and a valid password;
- To Sign Up user must enter a valid email, unique username, password and avatar;

### Main page

- Main chat page is divided to three columns: Chat list, main chat section, details section;
- Chat list section contains the main user info, search bar and the list of available chats;
- Search bar also allows to search existing users with the username;
- Center section shows the currently selected chat with the info of the interlocutor;
- Right section lists chat's details including some settings, images, block button and the button for the log out;

## Details

- Signing Up and Logging In are handled via Firebase service;
- Data fetching is handled via Firebase service;
- All the data is stored in the Firestore database;
- Styles are handled via Vanilla CSS with BEM;
- Notifications are handled via Toastify library;
- State management is handled via Zustand;

### Live version

https://vsbron-react2024-modern-chat-app.netlify.app/
