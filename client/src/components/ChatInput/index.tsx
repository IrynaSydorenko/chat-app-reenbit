import React, { useState } from 'react';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import Picker from 'emoji-picker-react';
import styles from './ChatInput.module.scss';

interface ChatInputProps {
  handleSendMsg: (msg: string) => void;
}

const ChatInput = ({ handleSendMsg }: ChatInputProps) => {
  const [msg, setMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event: any, emojiObject: any) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event: React.FormEvent) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.buttonContainer}>
        <div className={styles.emoji}>
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className={styles.inputContainer} onSubmit={sendChat}>
        <input
          type='text'
          placeholder='Type your message here'
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type='submit'>
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
