import React, { useContext, useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { StateContext } from '../lib';
import { IChatMessage, ToServerEvents } from 'shared';
import { CSSTransition, Transition } from 'react-transition-group';
import { UsersList } from '.';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1rem;
  height: 75vh;
  width: 16rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #4a4a4a;
  position: relative;
`;

const ChatContent = styled.div`
  padding: 0 0.4rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
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

const ChatButton = styled.button`
  background-color: transparent;
  border-style: none;
  font-size: 1.75rem;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
`;

const JustifyBetween = styled(Row)`
  justify-content: space-between;
  align-items: center;
  background-color: #a5f1ff;
  padding: 0.25rem 0;
  margin-bottom: 0.25rem;
  box-shadow: 0 5px 5px -5px black;
`;

const RowReverse = styled(Row)`
  flex-direction: row-reverse;
`;

const OpenChatButton = styled(RowReverse)`
  margin: 1.5rem 0.75rem 0 0;
`;

const UserMessage = styled.div`
  background-color: #7adaec;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 5px 0 2.5px 1rem;
  max-width: 12.5rem;
  overflow-wrap: break-word;
`;

const ReceivedMessage = styled.div`
  background-color: #385054;
  color: white;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 1px 1rem 2.5px 0;
  max-width: 12.5rem;
  overflow-wrap: break-word;
`;

const MessageOwner = styled.span`
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 0.25rem;
`;

const ChatInput = styled.textarea`
  font-family: inherit;
  width: 100%;
  resize: none;
  max-height: 7.5rem;
  border: 3px solid transparent;
  border-radius: 5px;
  padding: 8px;
  transition: border-color 0.3s;
  cursor: auto;
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

export const Chat: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { socket, user, room, chatLog } = state;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [closing, setClosing] = useState<boolean>(true);
  const [chatInputValue, setChatInputValue] = useState('');
  const chatBoxScrollRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatBoxScrollRef.current) {
      chatBoxScrollRef.current.scrollTop = chatBoxScrollRef.current.scrollHeight;
    }
  }, [chatLog, isOpen]);

  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height = '0px';
      const scrollHeight = chatInputRef.current.scrollHeight;
      chatInputRef.current.style.height = scrollHeight + 5 + 'px';
    }
  }, [chatInputRef.current, chatInputValue]);

  const handleChatInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target?.value;
    setChatInputValue(val);
  };

  // const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
  const handleSend: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!room || !user) return console.warn('<Chat>: Room or user not found', state, event);
    const form = event.target as EventTarget & HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries<string>(formData.entries() as Iterable<readonly [PropertyKey, string]>);
    const chatMessage = {
      roomName: room.roomName,
      username: user.username,
      message: formJson.chat,
    };
    mergeState({ chatLog: [...state.chatLog, chatMessage] });
    socket.emit(ToServerEvents.sschatSend, chatMessage);
    form.reset();
    setChatInputValue('');
    chatInputRef.current?.focus();
    console.log('<Chat>: ', event, state, formJson, chatMessage);
  };

  // const sendOnEnter = (event) => {
  //   if (event.keyCode == 13 && event.shiftKey == false) {
  //     handleSend(event);
  //   }
  // };

  const toggleChatOpen = (isOpen: boolean) => {
    setClosing(!isOpen);
    if (isOpen) setTimeout(() => setIsOpen(false), 400);
    else setIsOpen(true);
  };

  const mapChatLog = (chat: IChatMessage, index: number) => {
    let content: JSX.Element;
    if (chat.username === 'System') {
      content = <em style={{ color: 'gray' }}>{chat.message}</em>;
    } else if (chat.username === user?.username) {
      content = (
        <RowReverse>
          <UserMessage>
            <span>{`${chat.message}`}</span>
          </UserMessage>
        </RowReverse>
      );
    } else {
      content = (
        <>
          <MessageOwner>{chat.username}</MessageOwner>
          <Row>
            <ReceivedMessage>
              <span>{`${chat.message}`}</span>
            </ReceivedMessage>
          </Row>
        </>
      );
    }
    return <div key={index}>{content}</div>;
  };

  return (
    <div>
      {isOpen ? (
        <ChatContainer className={closing ? 'chat-open' : 'chat-close'}>
          <JustifyBetween>
            <UsersList />
            <span>Chat</span>
            <ChatButton onClick={() => toggleChatOpen(isOpen)}>➡️</ChatButton>
          </JustifyBetween>
          <ChatContent ref={chatBoxScrollRef} id="chatbox">
            <div>{chatLog.map(mapChatLog)}</div>
          </ChatContent>
          <form onSubmit={handleSend}>
            {/* <input type="text" name="chat" placeholder="Send a message..." required ref={chatInputRef}></input> */}
            <Row>
              <ChatInput
                name="chat"
                placeholder="Send a message..."
                required
                ref={chatInputRef}
                rows={1}
                onChange={handleChatInput}
                value={chatInputValue}
              ></ChatInput>
              <button type="submit">✈️</button>
            </Row>
          </form>
        </ChatContainer>
      ) : (
        <div>
          <OpenChatButton>
            {!isOpen && <ChatButton onClick={() => toggleChatOpen(isOpen)}>💬</ChatButton>}
          </OpenChatButton>
        </div>
      )}
    </div>
  );
};
