import React, { memo, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { IUser, SoundOrigin, ToServerEvents } from 'shared';
import { IState, PlayerController, StateContext } from '../lib';

const PlayerContainer = styled.div`
  width: 100%;
  margin: 1rem;
`;

const FluidDiv = styled.div`
  width: 100%;
  height: 100%;
`;

interface PlayerProps {
  room: IState['room'];
  player: IState['player'];
  playerStatus: IState['playerStatus'];
  socket: IState['socket'];
  user: IUser | null;
}

export const Player: React.FC<PlayerProps> = memo(({ room, player, playerStatus, socket, user }) => {
  const { mergeState, setState } = useContext(StateContext);

  useEffect(() => {
    if (player != null || !room || !room.playlist.length) return;
    const currentSound = room.playlist[0];
    const newPlayer = new PlayerController(currentSound, setState);
    console.log('<Player>: Adding PlayerController for SC', currentSound, newPlayer);
    mergeState({ player: newPlayer });
  }, [player, room]);

  useEffect(() => {
    console.log('<Player>: useEffect()[playerStatus]', playerStatus, room, user, player);
    if (!playerStatus || !room || !user || !player?.player) return;
    const { isPlaying, shouldEmit } = playerStatus;
    const data = { roomName: room.roomName, username: user.username };
    if (isPlaying) {
      if (shouldEmit) socket.emit(ToServerEvents.ssplayerPlay, data);
      else player.play();
    } else {
      if (shouldEmit) socket.emit(ToServerEvents.ssplayerPause, data);
      else player.pause();
    }
  }, [playerStatus]);

  const renderPlayer = (): JSX.Element | null => {
    if (!room || !room.playlist.length) return null;
    const currentSound = room.playlist[0];
    if (currentSound.origin === SoundOrigin.SC)
      return (
        <iframe
          id="ssplayer"
          src={currentSound.src}
          height="100%"
          width="100%"
          allow="autoplay"
          frameBorder="no"
          scrolling="no"
        ></iframe>
      );
    return <FluidDiv id="ssplayer"></FluidDiv>;
  };

  return <PlayerContainer id="player-container">{renderPlayer()}</PlayerContainer>;
});
