import React, { useContext, useRef } from 'react';
import { StateContext } from '../lib';
import { IChatMessage, ToServerEvents } from 'shared';

export const Chat: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { socket, user, room, chatLog } = state;

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
    <div>
      <div>{chatLog.map(mapChatLog)}</div>
      <form onSubmit={handleSend}>
        <input type="text" name="chat" placeholder="Send a message..." required></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
