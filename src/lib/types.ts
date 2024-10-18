// UI Types
export type AvatarProps = {
  src: string;
  altTitle: string;
  size: string;
};

export type ButtonProps = {
  children: string;
  padding: string;
  onClick: React.MouseEventHandler;
  disabled: boolean;
};

// Utils Types
export type CloseModalProps = {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  triggerClass: string;
  modalClass: string;
};
