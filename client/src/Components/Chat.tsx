import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { StateContext } from '../lib';
import { IChatMessage, ToServerEvents } from 'shared';

const ChatContainer = styled.div`
  padding: 1rem;
  margin: 1rem;
  height: 40rem;
  border: 1px solid black;
  border-radius: 4px;
  padding: 1rem;
`;

const ChatContent = styled.div`
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

const RowReverse = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const Chat: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { socket, user, room, chatLog } = state;
  const [isOpen, setIsOpen] = useState<boolean>(true);

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
    console.log('<Chat>: ', event, state, formJson, chatMessage);
  };

  const mapChatLog = (chat: IChatMessage, index: number) => {
    let content: JSX.Element;
    if (chat.username === 'System') {
      content = <em style={{ color: 'gray' }}>{chat.message}</em>;
    } else if (chat.username === user?.username) {
      content = <span>{`You: ${chat.message}`}</span>;
    } else {
      content = <span>{`${chat.username}: ${chat.message}`}</span>;
    }
    return <div key={index}>{content}</div>;
  };

  return (
    <ChatContainer>
      <RowReverse>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Hide Chat' : 'Show Chat'}</button>
      </RowReverse>
      {isOpen && (
        <>
          <ChatContent id="chatbox">
            <div>{chatLog.map(mapChatLog)}</div>
          </ChatContent>
          <RowReverse>
            <form onSubmit={handleSend}>
              <input type="text" name="chat" placeholder="Send a message..." required></input>
              <button type="submit">Send</button>
            </form>
          </RowReverse>
        </>
      )}
    </ChatContainer>
  );
};
