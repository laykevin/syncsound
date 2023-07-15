import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ToServerEvents } from 'shared';
import { StateContext, SocketController } from '../lib';

const Flex = styled.div`
  display: flex;
`;

const ChatTextarea = styled.textarea`
  font-family: inherit;
  width: 100%;
  resize: none;
  max-height: 7.5rem;
  border: 3px solid transparent;
  border-radius: 5px;
  padding: 8px;
  transition: border-color 0.3s;
  cursor: auto;
  scrollbar-gutter: stable;
  &:focus {
    outline: none;
    border-color: #3ac6e0;
    box-shadow: 0 0 4px #3ac6e0;
  }
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 5px;
  }
`;

export const ChatTextArea: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { socket, room } = state;
  const [chatTextAreaValue, setChatTextAreaValue] = useState('');
  const chatTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const user = SocketController.getCurrentUser(state);

  useEffect(() => {
    if (chatTextAreaRef.current) {
      chatTextAreaRef.current.style.height = '0px';
      const scrollHeight = chatTextAreaRef.current.scrollHeight;
      chatTextAreaRef.current.style.height = scrollHeight + 6 + 'px';
    }
  }, [chatTextAreaRef.current, chatTextAreaValue]);

  const handleChatTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setChatTextAreaValue(event.target?.value);
  };

  const handleSend = (event: React.KeyboardEvent | React.MouseEvent): void => {
    event.preventDefault();
    chatTextAreaRef.current?.focus();
    if (!chatTextAreaValue.trim().length) return;
    if (!room || !user) return console.warn('<Chat>: Room or user not found', state, event);
    const chatMessage = {
      roomName: room.roomName,
      username: user.username,
      message: chatTextAreaValue,
    };
    mergeState({ chatLog: [...state.chatLog, chatMessage] });
    socket.emit(ToServerEvents.sschatSend, chatMessage);
    setChatTextAreaValue('');
    console.log('<Chat>: ', event, state, chatTextAreaValue, chatMessage);
  };

  const sendOnEnter = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSend(event);
    }
  };

  return (
    <Flex>
      <ChatTextarea
        name="chat"
        placeholder="Send a message..."
        required
        ref={chatTextAreaRef}
        rows={1}
        onChange={handleChatTextArea}
        value={chatTextAreaValue}
        onKeyDown={sendOnEnter}
      ></ChatTextarea>
      <button onClick={handleSend}>✈️</button>
    </Flex>
  );
};
