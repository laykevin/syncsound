import React, { useContext } from 'react';
import { StateContext } from '../lib';
import { styled } from 'styled-components';

const PlayerContainer = styled.div`
  margin: 1rem;
`;

export const Player: React.FC = () => {
  const { state } = useContext(StateContext);
  const { room } = state;

  return (
    <>
      <PlayerContainer id="player-container">
        {room?.playlist[0] && (
          <iframe
            width={1520 / 2}
            height={594 / 4}
            src={room.playlist[0].src}
            title={room.playlist[0].title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={false}
          ></iframe>
        )}
      </PlayerContainer>
    </>
  );
};
