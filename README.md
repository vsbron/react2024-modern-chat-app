# Modern Chat App

A single-page application (SPA) chat app built with React and Firebase.

## Features

### Login page

- When not authenticated, the login page displays Log In and Sign Up options;
- To log in, users must enter their registered email and a valid password;
- To sign up, users must enter a valid email, a unique username, a password, and an avatar;

### Main page

- The main chat page is divided into three columns: Chat List, Main Chat Section, and Details Section;
- The Chat List section contains the main user information, settings icon, log out button, a search bar, and a list of available chats;
- Settings menu allows user to update his avatar, username, password, description and password;
- Color scheme can also be selected at the bottom of the Settings menu;
- The search bar features an input to filter the current chat list and an Add User button;
- The Add User modal allows users to search for others and start a chat with them;
- The center section displays the currently selected chat, including information about the interlocutor;
- The current chat allows sending and receiving text, emojis, and images;
- The right section lists the interlocutor's details, list of shared images and files and option to block him;
- The images and files sections shows all files shared in the chat, with the option to download them individually;
- The block button in the right section prevents the interlocutor from sending or receiving messages;

## Details

- Signing up and logging in are handled via Firebase;
- Data fetching is handled via Firebase;
- All data is stored in the Firestore database;
- Styles are managed via Vanilla CSS with the BEM methodology;
- Notifications are managed via the Toastify library;
- State management is handled via Zustand;
- The design is responsive, supporting mobile devices with a minimum width of 1200px;

## Improvements of the Original Project

- Updated color scheme;
- Created a logo and a new favicon;
- Each user's email is now displayed;
- Removed all unused icons from the UI and replaced the remaining ones with SVGs;
- Settings menu with profile customizations;
- In the Add Users feature, users can be found by their username or email;
- Users cannot add themselves or others who are already in their chat list;
- Color scheme selector at the bottom of Settings menu;
- If a user has blocked the current user, their name and avatar are still visible;
- When a chat is open, an "X" icon allows users to close it and return to the start section;
- The Add User and Emoji modals now close when clicking outside or pressing the Esc key;
- Messages can now be sent by pressing the Enter key;
- When attaching a file or image, it is properly displayed near the input with the filename and an option to remove it;
- Attached files/images are now correctly displayed in the chat window, with the file name (for files) and an option to download it;
- All shared files and images are listed in the right part of the chat under respective dropdowns, with options to download them;

### Live version

https://vsbron-react2024-modern-chat-app.netlify.app/
