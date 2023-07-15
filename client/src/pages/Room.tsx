import React, { useContext } from 'react';
import styled from 'styled-components';
import { Chat, Playlist, Player, PlayerControls } from '../components';
import { SocketController, StateContext } from '../lib';

interface RoomProps {
  roomName: string;
}

const FlexCenter = styled.div`
  display: flex;
  justify-content: space-between;
  overflow-x: hidden;
`;

const Container = styled(FlexCenter)`
  flex-direction: column;
  align-items: center;
  background-color: #3ac6e0;
  box-shadow: 0 0 2px 0 darkorange;
`;

export const Room: React.FC<RoomProps> = ({ roomName }) => {
  const { state } = useContext(StateContext);
  const { room, player, playerStatus, socket } = state;
  const user = SocketController.getCurrentUser(state);
  const playerProps = { room, player, playerStatus, socket, user };

  return (
    <>
      <Container>
        <h2>SyncSound</h2>
        <h3>{roomName}</h3>
      </Container>
      <FlexCenter>
        <Playlist />
        <Player {...playerProps} />
        <Chat />
      </FlexCenter>
      <Container>
        <PlayerControls />
      </Container>
    </>
  );
};
