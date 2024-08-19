import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '../ChatInput';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageRoute, recieveMessageRoute } from '../../utils/APIRoutes';
import { toast } from 'react-toastify';
import styles from './ChatContainer.module.scss';
import formatDate from '../../utils/FormatDate';
import axiosInstance from '../../utils/axiosInstance';
import { Chat, Message, User } from '../../types';

interface ChatContainerProps {
  currentChat: Chat;
  currentUser: User | undefined;
  socket: React.MutableRefObject<any>;
  updateLastMessage: (chatId: string, lastMessage: string) => void;
}

const ChatContainer = ({
  currentChat,
  currentUser,
  socket,
  updateLastMessage,
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.post(recieveMessageRoute, {
          chatId: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg: string) => {
    const messageData = {
      userId: currentUser!._id,
      chatId: currentChat._id,
      message: msg,
      sender: 'user',
    };

    try {
      if (!socket.current) {
        console.error('Socket not initialized!');
        return;
      }

      socket.current.emit('send-msg', messageData);
      await axiosInstance.post(sendMessageRoute, messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromSelf: true,
          message: msg,
          createdAt: new Date().toISOString(),
        },
      ]);

      updateLastMessage(currentChat._id, msg);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (!socket.current) {
      console.error('Socket not initialized!');
      return;
    }

    const currentSocket = socket.current;

    const handleMessageReceive = (msg: any) => {
      toast.info(`New message from ${currentChat.title}: ${msg.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setArrivalMessage({
        fromSelf: false,
        message: msg.message,
        createdAt: msg.createdAt,
      });

      updateLastMessage(currentChat._id, msg.message);
    };

    currentSocket.on('msg-recieve', handleMessageReceive);

    return () => {
      currentSocket.off('msg-recieve', handleMessageReceive);
    };
  }, [socket, currentChat.title, currentChat._id, updateLastMessage]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.userDetails}>
          <div className={styles.avatar}>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage || ''}`}
              alt='avatar'
            />
          </div>
          <div className={styles.username}>
            <h3>{currentChat.title}</h3>
          </div>
        </div>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`${styles.message} ${
                message.fromSelf ? styles.sended : styles.received
              }`}
            >
              <div className={styles.content}>
                <p>{message.message}</p>
                <small className={styles.timestamp}>
                  {formatDate(message.createdAt)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
