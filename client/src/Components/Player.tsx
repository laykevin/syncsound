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

const FluidIFrame = styled.iframe`
  width: 100%;
  height: 100%;
`;

export const Player: React.FC = () => {
  const { state, mergeState } = useContext(StateContext);
  const { room, player } = state;

  useEffect(() => {
    const updatePlayer = async () => {
      if (player != null || !room || !room.playlist.length) return;
      const currentSound = room.playlist[0];
      const newPlayer = new PlayerController(currentSound, mergeState);
      console.log('<Player>: Adding PlayerController for SC', currentSound, newPlayer);
      mergeState({ player: newPlayer });
    };
    updatePlayer();
  }, [player, room]);

  const renderPlayer = (): JSX.Element | null => {
    if (!room || !room.playlist.length) return null;
    const currentSound = room.playlist[0];
    if (currentSound.origin === SoundOrigin.SC)
      return (
        <FluidIFrame
          // width={1520 / 2}
          // height={594 / 4}
          id="ssplayer"
          src={currentSound.src}
          title={currentSound.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={false}
          // @ts-ignore
          enablejsapi="1"
        ></FluidIFrame>
      );
    return <FluidDiv id="ssplayer"></FluidDiv>;
  };

  return <PlayerContainer id="player-container">{renderPlayer()}</PlayerContainer>;
};
