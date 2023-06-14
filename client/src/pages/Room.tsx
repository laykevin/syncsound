import React from 'react';
import styled from 'styled-components';
import { Chat, Playlist } from '../components';

interface RoomProps {
  roomName: string;
}

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled(FlexCenter)`
  flex-direction: column;
`;

export const Room: React.FC<RoomProps> = ({ roomName }) => {
  return (
    <Container>
      <h2>SyncSound</h2>
      <h3>{roomName}</h3>
      <FlexCenter>
        <Chat />
        <Playlist />
      </FlexCenter>
    </Container>
  );
};
