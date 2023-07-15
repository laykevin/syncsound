import React, { useContext, useEffect } from 'react';
import { PlayerController, SocketController, StateContext } from '../lib';
import { styled } from 'styled-components';
import { SoundOrigin, ToServerEvents } from 'shared';

const PlayerContainer = styled.div`
  width: 100%;
  margin: 1rem;
`;

const FluidDiv = styled.div`
  width: 100%;
  height: 100%;
`;

export const Player: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { room, player, isPlaying, socket } = state;
  const user = SocketController.getCurrentUser(state);

  useEffect(() => {
    if (player != null || !room || !room.playlist.length) return;
    const currentSound = room.playlist[0];
    const newPlayer = new PlayerController(currentSound, mergeState);
    console.log('<Player>: Adding PlayerController for SC', currentSound, newPlayer);
    mergeState({ player: newPlayer });
  }, [player, room]);

  useEffect(() => {
    const updatePlayerStatus = async () => {
      if (!room || !user || !player?.player) return;
      const isPlayerPaused = await player.isPlayerPaused();
      console.log('<Player> useEffect [isPlaying]', 'isPlaying=' + isPlaying, 'isPlayerPaused=' + isPlayerPaused);

      if (isPlaying) {
        if (isPlayerPaused) player.play();
        else socket.emit(ToServerEvents.ssplayerPlay, { roomName: room.roomName, username: user.username });
      } else {
        if (!isPlayerPaused) player.pause();
        else socket.emit(ToServerEvents.ssplayerPause, { roomName: room.roomName, username: user.username });
      }
    };
    updatePlayerStatus();
  }, [isPlaying]);

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
};
