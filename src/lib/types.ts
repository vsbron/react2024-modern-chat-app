import React from "react";

// Global Types
export type ChatType = {
  createdAt: CreatedAtType;
  messages: MessageType[];
  receiverId?: string;
};
export type ChatObject = {
  chatId: string;
  isSeen: boolean;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  user: User;
};
export type CreatedAtType = { seconds: number; nanoseconds: number } | Date;
export type FileType = {
  file: File;
  url: string;
  type: string;
};
export type MessageType = {
  senderId: string;
  text: string;
  createdAt: CreatedAtType;
  img?: string;
  file?: File;
  fileName?: string;
};

// Components Types
export type AddUserProps = {
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
};
export type ChatProps = {
  chat: ChatType;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};
export type DetailsProps = {
  key: string;
  chat: ChatType;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
};
export type EmojiModalProps = {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setOpenEmoji: React.Dispatch<React.SetStateAction<boolean>>;
};
export type SettingsProps = {
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};
export type UserInfoProps = {
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

// UI Types
export type AvatarProps = {
  src: string;
  altTitle?: string;
  size: string;
};

export type ButtonProps = {
  children: React.ReactNode;
  padding: string;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
};

// Utils Types
export type CloseModalProps = {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  triggerClass: string;
  modalClass: string;
};

// State Types
export type AvatarState = {
  file: File | null;
  src: string;
};
export type FileState = {
  file: File | null;
  url: string;
  type: string;
};

// Stores Props
export interface ChatStoreState {
  chatId: string | null;
  user: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeBlocked: () => void;
  changeChat: ({ chatId, userInfo }: ChangeChatProps) => void;
  resetChat: () => void;
}
export interface UserStoreState {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string) => void;
  updateUserInfo: (uid: string, updatedData: UpdatedDataType) => void;
  clearUserInfo: () => void;
}

export type ChangeChatProps = {
  chatId: string;
  userInfo: User;
};

export type UpdatedDataType = {
  username?: string;
  email?: string;
  description?: string;
  avatar?: string;
  color?: string;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  blocked: string[];
  pinned: string[];
  description: string;
  color: string;
  email: string;
};
