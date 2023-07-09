import React, { useContext, useEffect } from 'react';
import { PlayerController, StateContext } from '../lib';
import { styled } from 'styled-components';
import { SoundOrigin } from 'shared';

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
  const { room, player } = state;

  useEffect(() => {
    if (player != null || !room || !room.playlist.length) return;
    const currentSound = room.playlist[0];
    const newPlayer = new PlayerController(currentSound, mergeState);
    console.log('<Player>: Adding PlayerController for SC', currentSound, newPlayer);
    mergeState({ player: newPlayer });
  }, [player, room]);

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
