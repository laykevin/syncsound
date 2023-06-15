import React, { useContext, useState, useEffect, useRef, useTransition } from 'react';
import { styled, keyframes } from 'styled-components';
import { StateContext } from '../lib';
import { IChatMessage, ToServerEvents } from 'shared';
import { CSSTransition } from 'react-transition-group';
import { UsersList } from '.';

const DrawerAnimationOpen = keyframes`
  0% {
    right: -283px;
  }
  100% {
    right: 0;
  }
  `;

const DrawerAnimationClose = keyframes`
  0% {
    right: 0;
  }
  100% {
    right: -283px;
  }
`;

const ChatContainer = styled.div`
  padding: 0 1rem 1rem 1rem;
  margin: 1rem;
  height: 75vh;
  width: 16rem;
  border: 1px solid black;
  border-radius: 4px;
  position: relative;
  animation-name: ${DrawerAnimationOpen};
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
`;

const ChatContent = styled.div`
  height: 92%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 5px;
  }
`;

const Row = styled.div`
  display: flex;
`;

const RowReverse = styled(Row)`
  flex-direction: row-reverse;
`;

const UserMessage = styled.div`
  background-color: lightblue;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 5px 0 2.5px 1rem;
  max-width: 12.5rem;
  overflow-wrap: break-word;
`;

const ReceivedMessage = styled.div`
  background-color: grey;
  color: white;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 1px 1rem 2.5px 0;
  max-width: 12.5rem;
  overflow-wrap: break-word;
`;

const MessageOwner = styled.span`
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 0.25rem;
`;

export const Chat: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { socket, user, room, chatLog } = state;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  console.log('Current Users', room?.users);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatLog, isOpen]);

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
    chatInputRef.current?.focus();
    console.log('<Chat>: ', event, state, formJson, chatMessage);
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
      <RowReverse>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Hide Chat' : 'Show Chat'}</button>
      </RowReverse>

      {isOpen && (
        // <CSSTransition in={isOpen} timeout={500} classNames="chat-container">
        <ChatContainer>
          <UsersList />
          <ChatContent ref={chatBoxRef} id="chatbox">
            <div>{chatLog.map(mapChatLog)}</div>
          </ChatContent>
          <RowReverse>
            <form onSubmit={handleSend}>
              <input type="text" name="chat" placeholder="Send a message..." required ref={chatInputRef}></input>
              <button type="submit">Send</button>
            </form>
          </RowReverse>
        </ChatContainer>
        // </CSSTransition>
      )}
    </div>
  );
};
