// Global Types
export type ChatType = {
  createdAt: CreatedAtType;
  messages: MessageType[];
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
  altTitle: string;
  size: string;
};

export type ButtonProps = {
  children: string;
  padding: string;
  onClick?: React.MouseEventHandler;
  disabled: boolean;
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
