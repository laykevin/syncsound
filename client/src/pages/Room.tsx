import React from 'react';
import styled from 'styled-components';
import { Chat } from '../components';

interface RoomProps {
  roomName: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Room: React.FC<RoomProps> = ({ roomName }) => {
  return (
    <Container>
      <h2>SyncSound</h2>
      <h3>{roomName}</h3>
      <Chat />
    </Container>
  );
};
