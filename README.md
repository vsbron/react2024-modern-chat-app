# Modern Chat App

A single-page application (SPA) chat app built with React and Firebase.

## Features

### Login Page

- When not authenticated, the login page displays **Log In** and **Sign Up** options.
- To log in, users enter their registered email and a valid password.
- To sign up, users enter a valid email, unique username, password, and avatar.

### Main Page

- The main chat page is divided into three columns: **Chat List**, **Main Chat Section**, and **Details Section**.
- **Chat List**:
  - Displays main user information, a settings icon, logout button, search bar, and list of available chats.
  - **Settings** menu allows profile updates (avatar, username, password, description) and color scheme selection.
  - **Search bar** includes an input to filter the chat list and an **Add User** button.
  - **Add User** modal lets users search for others by username or email and initiate chats.
- **Main Chat Section**:
  - Shows the selected chat and information about the chat partner.
  - Allows sending and receiving text, emojis, and images.
- **Details Section**:
  - Lists chat partner details, shared images and files, and a block option.
  - **Images and Files** sections display shared items with individual download options.
  - **Block** button prevents messages from being exchanged with the chat partner.

## Technical Details

- Authentication is managed via **Firebase**.
- Data fetching and storage are handled by **Firestore**.
- **Vanilla CSS** with **BEM methodology** for styling.
- **Toastify** library manages notifications.
- **Zustand** is used for state management.
- **HeroIcons** are used for some icons.
- Responsive design supports mobile devices with a minimum width of 360px.

## Improvements of the Original Project

- **Rewritten** as a React SPA with **TypeScript**.
- Enhanced color scheme and updated **responsive support**.
- Added a custom **logo** and favicon.
- User emails are now displayed in the app.
- UI icons were optimized, unused icons removed, and active icons replaced with SVGs.
- **Profile customization** options in the settings menu.
- **Add Users** feature allows finding users by username or email.
  - Self-addition or re-adding existing contacts is restricted.
- **Color scheme selector** is now accessible in the settings menu.
- **Blocked user visibility**: avatars and names remain visible even if a user has blocked another.
- Close chats quickly with an **"X" icon** in the main chat.
- **Pinned chats**: pin and unpin conversations for quick access.
- **Modals** (Add User, Emoji) close on outside click or Esc key press.
- Press **Enter** to send messages directly.
- File/image attachments display next to the input with filename and removal option.
- Attachments now appear in the chat window, with a **file name** (for files) and download option.
- Shared files/images are organized under **dropdowns** in the Details section, each with a download button.

## License

© 2024 BroN

This repository is intended for portfolio/demo purposes. Permission is granted to view and run the project for personal evaluation. Reuse, redistribution, or commercial use is not permitted without written permission.

### Live version

https://vsbron-react2024-modern-chat-app.netlify.app/
