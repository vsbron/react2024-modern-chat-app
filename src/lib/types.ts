// Global Types
export type ChatType = {
  createdAt: { seconds: number; nanoseconds: number };
  messages: MessageType[];
};
export type MessageType = {
  senderId: string;
  text: string;
  createdAt: any;
  img?: string;
  file?: File;
  fileName?: string;
};

// Components Types
export type ChatProps = {
  chat: any;
  setShowDetails: any;
  isLoading: boolean;
};
export type DetailsProps = {
  key: string;
  chat: any;
  showDetails: any;
  setShowDetails: any;
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
export type FileState = {
  file: any;
  url: string;
  type: string;
};
