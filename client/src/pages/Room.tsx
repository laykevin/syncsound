import React from 'react';
import styled from 'styled-components';
import { Chat, Playlist } from '../components';

interface RoomProps {
  roomName: string;
}

const FlexCenter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Container = styled(FlexCenter)`
  flex-direction: column;
  align-items: center;
`;

export const Room: React.FC<RoomProps> = ({ roomName }) => {
  return (
    <>
      <Container>
        <h2>SyncSound</h2>
        <h3>{roomName}</h3>
      </Container>
      <FlexCenter>
        <Playlist />
        <Chat />
      </FlexCenter>
    </>
  );
};
