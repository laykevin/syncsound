import React, { useContext, useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { StateContext, SyncSoundClient } from '../lib';
import { IChatMessage } from 'shared';
import { ChatTextArea, UsersList } from '.';

const Flex = styled.div`
  display: flex;
`;

const ChatContainer = styled(Flex)`
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

const ChatMessagesContainer = styled(Flex)`
  padding: 0 0.4rem;
  margin-bottom: 0.25rem;
  height: 100%;
  flex-direction: column-reverse;
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

const ChatHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  background-color: #a5f1ff;
  padding: 0.25rem 0;
  margin-bottom: 0.25rem;
  box-shadow: 0 5px 5px -5px black;
`;

const FlexReverse = styled(Flex)`
  flex-direction: row-reverse;
`;

const OpenChatButton = styled(FlexReverse)`
  margin: 1.5rem 0.75rem 0 0;
`;

const UserMessage = styled.div`
  background-color: #7adaec;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 5px 0 2.5px 1rem;
  max-width: 12.5rem;
  overflow-wrap: break-word;
  white-space: pre-line;
`;

const ReceivedMessage = styled.div`
  background-color: #385054;
  color: white;
  border-radius: 15px;
  padding: 5px 0.75rem 5px;
  margin: 1px 1rem 2.5px 0;
  max-width: 12.5rem;
  overflow-wrap: break-word;
  white-space: pre-line;
`;

const MessageOwner = styled.span`
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 0.25rem;
`;

export const Chat: React.FC = () => {
  const { state } = useContext(StateContext);
  const { chatLog } = state;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [opening, setOpening] = useState<boolean>(true);
  const chatBoxScrollRef = useRef<HTMLDivElement>(null);
  const user = SyncSoundClient.getCurrentUser(state);

  //Keeps messaages scrolled to bottom
  useEffect(() => {
    if (chatBoxScrollRef.current) {
      chatBoxScrollRef.current.scrollTop = chatBoxScrollRef.current.scrollHeight;
    }
  }, [chatLog, isOpen]);

  const toggleChatOpen = (isOpen: boolean): void => {
    setOpening(!isOpen);
    if (isOpen) setTimeout(() => setIsOpen(false), 400);
    else setIsOpen(true);
  };

  const mapChatLog = (chat: IChatMessage, index: number) => {
    let content: JSX.Element;
    if (chat.username === 'System') {
      content = <em style={{ color: 'gray' }}>{chat.message}</em>;
    } else if (chat.username === user?.username) {
      content = (
        <FlexReverse>
          <UserMessage>{chat.message}</UserMessage>
        </FlexReverse>
      );
    } else {
      content = (
        <>
          <MessageOwner>{chat.username}</MessageOwner>
          <Flex>
            <ReceivedMessage>{chat.message}</ReceivedMessage>
          </Flex>
        </>
      );
    }
    return <div key={index}>{content}</div>;
  };

  return (
    <div>
      {isOpen ? (
        <ChatContainer className={opening ? 'chat-open' : 'chat-close'}>
          <ChatHeader>
            <UsersList />
            <span>Chat</span>
            <ChatButton onClick={() => toggleChatOpen(isOpen)}>➡️</ChatButton>
          </ChatHeader>
          <ChatMessagesContainer ref={chatBoxScrollRef} id="chatbox">
            <div>{chatLog.map(mapChatLog)}</div>
          </ChatMessagesContainer>
          <ChatTextArea />
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
