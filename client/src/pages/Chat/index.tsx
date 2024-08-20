import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { allChatsRoute } from '../../utils/APIRoutes';
import ChatContainer from '../../components/ChatContainer';
import Contacts from '../../components/Contacts';
import styles from './Chat.module.scss';
import { useNavigate } from 'react-router-dom';
import { Chat as ChatI, User } from '../../types';
import { isAuthenticated, getUserFromLocalStorage } from '../../utils/auth';
import axiosInstance from '../../utils/axiosInstance';
import Welcome from '../../components/Welcome/Welcome';

const Chat: React.FC = () => {
  const socket = useRef<any>(null);
  const [chats, setChats] = useState<ChatI[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatI | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      const user = getUserFromLocalStorage();
      setCurrentUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser && currentUser.avatarImage) {
        try {
          const { data } = await axiosInstance.get(allChatsRoute, {
            params: { userId: currentUser._id },
          });
          setChats(data);
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      } else if (currentUser) {
        navigate('/setAvatar');
      }
    };

    fetchChats();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && !socket.current) {
      socket.current = io(process.env.API_URL ?? 'http://localhost:5000');
      socket.current.emit('add-user', currentUser._id);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  const handleChatChange = (chat: ChatI | undefined) => {
    setCurrentChat(chat);
  };
  const updateLastMessage = (chatId: string, lastMessage: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              lastMessage: {
                message: lastMessage,
                createdAt: new Date().toISOString(),
              },
            }
          : chat
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatLayout}>
        <Contacts
          chats={chats}
          changeChat={handleChatChange}
          setChats={setChats}
          currentUser={currentUser}
          currentChat={currentChat}
        />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          socket.current && (
            <ChatContainer
              currentUser={currentUser}
              currentChat={currentChat}
              socket={socket}
              updateLastMessage={updateLastMessage}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Chat;
