# Modern Chat App

A single-page application (SPA) chat app built with React and Firebase.

Originally created as a course project, this application was fully refactored and significantly expanded with improved architecture, state management, UI/UX enhancements, and additional product-level features.

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
- Real-time updates via **Firestore listeners** (`onSnapshot`).
- **Vanilla CSS** with **BEM methodology** for styling.
- **Toastify** library manages notifications.
- **Zustand** is used for state management.
- Code-splitting using React.lazy and Suspense to reduce initial bundle size
- **HeroIcons** are used for some icons.
- Responsive design supports mobile devices with a minimum width of 360px.

## Key Improvements over the Original project (Refactor + Feature Expansion)

This project started as a course-based chat app and was later fully rewritten and expanded into a more production-style SPA.

### Engineering & Architecture

- Rewritten as a React SPA with **TypeScript**
- Improved UI structure and responsiveness (mobile min-width: 360px)
- Optimized icon usage (removed unused assets, replaced active icons with SVGs)

### UX & Product Features

- Settings menu with profile customization (avatar, username, password, description)
- Theme / color scheme selector
- Add Users flow (search by username or email)
  - Prevents self-add and duplicate chats
- Pinned chats for quick access
- Quick close chat action ("X" button)
- Improved modal behavior (outside click + Esc to close)
- Enter-to-send support

### Messaging & Attachments

- Send text, emojis, and images
- File/image attachment preview + remove before sending
- Attachments appear in chat with filename + download option
- Shared files/images displayed in the Details panel with per-item download buttons
- Block user support (prevents message exchange while keeping avatars/names visible)

## License

© 2024 BroN

This repository is intended for portfolio/demo purposes. Permission is granted to view and run the project for personal evaluation. Reuse, redistribution, or commercial use is not permitted without written permission.

### Live version

https://vsbron-react2024-modern-chat-app.netlify.app/
