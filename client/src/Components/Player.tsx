import React, { useContext, useEffect } from 'react';
import { PlayerController, StateContext } from '../lib';
import { styled } from 'styled-components';
import { SoundOrigin } from 'shared';

const PlayerContainer = styled.div`
  width: 100%;
  margin: 1rem;
`;

const ResponsiveIFrame = styled.iframe`
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
      const newPlayer = new PlayerController(currentSound);
      if (currentSound.origin === SoundOrigin.YT) {
        const isLoaded = await newPlayer.loadYTPlayerAPI();
      }
      console.log('<Player>: Adding PlayerController for SC', currentSound, newPlayer);
      mergeState({ player: newPlayer });
    };
    updatePlayer();
  }, [player, room]);

  return (
    <PlayerContainer id="player-container">
      {room?.playlist[0] && (
        <div id="ssplayer"></div>
        // <ResponsiveIFrame
        //   // width={1520 / 2}
        //   // height={594 / 4}
        //   id="ssplayer"
        //   src={room.playlist[0].src + `?enablejsapi=1&version=3&origin=${window.location.href}`}
        //   title={room.playlist[0].title}
        //   frameBorder="0"
        //   // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        //   allowFullScreen={false}
        //   // @ts-ignore
        //   enablejsapi="1"
        // ></ResponsiveIFrame>
      )}
    </PlayerContainer>
  );
};
