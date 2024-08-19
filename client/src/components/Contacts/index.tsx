import { Dispatch, SetStateAction, useState } from 'react';
import Search from '../Search';
import DialogModal from '../DialogModal';
import {
  createChatRoute,
  deleteChatRoute,
  updateChatNameRoute,
} from '../../utils/APIRoutes';
import { toast } from 'react-toastify';
import { FaTimes, FaEdit } from 'react-icons/fa';
import styles from './Contacts.module.scss';
import { Chat, User } from '../../types';
import ToastNotification from '../ToastNotification';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';
import Logout from '../Logout';

interface ContactsProps {
  changeChat: (chat: Chat | undefined) => void;
  currentChat: Chat | undefined;
  chats: Chat[];
  currentUser: User | undefined;
  setChats: Dispatch<SetStateAction<Chat[]>>;
}

const Contacts = ({
  currentUser,
  changeChat,
  setChats,
  chats,
  currentChat,
}: ContactsProps) => {
  const [currentSelected, setCurrentSelected] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<'create' | 'delete' | 'edit'>(
    'create'
  );
  const [dialogData, setDialogData] = useState<Partial<Chat>>({});

  const handleChatCreated = async (firstName: string, lastName: string) => {
    try {
      const avatarImage = await generateRandomAvatar();
      const { data } = await axiosInstance.post<Chat>(createChatRoute, {
        firstName,
        lastName,
        avatarImage,
      });
      setChats((prevChats) => [...prevChats, data]);
      setIsDialogOpen(false);
      toast.success(`Chat with "${data.title}" created.`);
    } catch (error) {
      console.error('Error in handleChatCreated:', error);
      toast.error('Failed to create chat. Please try again.');
    }
  };

  const handleChatDeleted = async (chatId: string) => {
    try {
      await axiosInstance.delete(`${deleteChatRoute}/${chatId}`);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
      if (currentChat?._id === chatId) changeChat(undefined);
      setIsDialogOpen(false);
      toast.success('Chat deleted successfully.');
    } catch (error) {
      console.error('Error in handleChatDeleted:', error);
      toast.error('Failed to delete chat. Please try again.');
    }
  };

  const handleChatUpdated = async (
    chatId: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const { data } = await axiosInstance.put<Chat>(updateChatNameRoute, {
        chatId,
        firstName,
        lastName,
      });
      setChats((prevChats) =>
        prevChats.map((chat) => (chat._id === chatId ? data : chat))
      );
      setIsDialogOpen(false);
      toast.success(`Chat name updated to "${data.title}".`);
    } catch (error) {
      console.error('Error in handleChatUpdated:', error);
      toast.error('Failed to update chat name. Please try again.');
    }
  };

  const handleOpenCreateChatDialog = () => {
    setDialogType('create');
    setDialogData({});
    setIsDialogOpen(true);
  };

  const handleOpenDeleteChatDialog = (chat: Chat) => {
    setDialogType('delete');
    setDialogData(chat);
    setIsDialogOpen(true);
  };

  const handleOpenEditChatDialog = (chat: Chat) => {
    setDialogType('edit');
    setDialogData(chat);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (data: any) => {
    if (dialogType === 'create') {
      await handleChatCreated(data.firstName, data.lastName);
    } else if (dialogType === 'delete') {
      await handleChatDeleted(data._id);
    } else if (dialogType === 'edit') {
      await handleChatUpdated(data._id, data.firstName, data.lastName);
    }
  };

  const generateRandomAvatar = async () => {
    const api = `https://api.multiavatar.com/4645646/${Math.floor(
      Math.random() * 1000
    )}`;
    try {
      const response = await axios.get(api, { responseType: 'text' });
      const base64Avatar = btoa(response.data);
      return base64Avatar;
    } catch (error) {
      console.error('Error generating avatar:', error);
      throw new Error('Failed to generate avatar');
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeCurrentChat = (index: number, chat: Chat) => {
    setCurrentSelected(index);
    changeChat(chat);
  };

  return (
    <>
      {currentUser?.avatarImage && currentUser?.username && (
        <div className={styles.contactsContainer}>
          <div className={styles.currentUser}>
            <Logout />
            <div className={styles.avatar}>
              <img
                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                alt='avatar'
              />
            </div>
            <div className={styles.username}>
              <h2>{currentUser.username}</h2>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <button
              onClick={handleOpenCreateChatDialog}
              style={{ padding: '10px' }}
            >
              New Chat
            </button>
          </div>
          <div className={styles.contacts}>
            {filteredChats.map((chat, index) => (
              <div
                key={chat._id}
                className={`${styles.contact} ${
                  index === currentSelected ? styles.selected : ''
                }`}
                onClick={() => changeCurrentChat(index, chat)}
              >
                <div className={styles.avatar}>
                  <img
                    src={`data:image/svg+xml;base64,${
                      chat.avatarImage || currentUser.avatarImage
                    }`}
                    alt='avatar'
                  />
                </div>
                <div className={styles.username}>
                  <h3>{chat.title}</h3>
                  <p className={styles.lastMessage}>
                    {chat.lastMessage
                      ? chat.lastMessage?.message.slice(0, 20) +
                          (chat.lastMessage?.message.length > 20
                            ? '...'
                            : '') || ''
                      : 'No messages yet'}
                  </p>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleOpenEditChatDialog(chat)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={{ marginTop: '1px' }}
                    className={styles.deleteButton}
                    onClick={() => handleOpenDeleteChatDialog(chat)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {isDialogOpen && (
            <DialogModal
              type={dialogType}
              data={dialogData}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleDialogSubmit}
            />
          )}
          <ToastNotification />
        </div>
      )}
    </>
  );
};

export default Contacts;
