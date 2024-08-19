export interface Chat {
  _id: string;
  title: string;
  avatarImage: string;
  lastMessage?: {
    createdAt: string;
    message: string;
  };
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatarImage: string;
  isAvatarImageSet: boolean;
  updatedAt: string;
}

export interface Message {
  fromSelf: boolean;
  message: string;
  createdAt: string;
}
