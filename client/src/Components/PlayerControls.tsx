import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { StateContext } from '../lib';

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

export const PlayerControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<string>('100');
  const { state } = useContext(StateContext);
  const { room, player, isPlaying } = state;

  const handlePlay = () => {
    if (!player || !room) return console.warn('<PlayerControls>: Missing data', player, room);
    if (isPlaying) player.pause();
    else player.play();
  };

  const isPlayEnabled = !!room?.playlist[0] && !!player;
  const isNextEnabled = isPlayEnabled && !!room?.playlist[1];

  return (
    <FlexCenter>
      <button disabled={!isPlayEnabled} onClick={handlePlay}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button disabled={!isNextEnabled}>⏭️</button>
      <button onClick={() => setIsMuted((prev) => !prev)}>{isMuted ? '🔊' : '🔇'}</button>
      <input type="range" min="1" max="100" value={volume} onChange={(e) => setVolume(e.target.value)}></input>
      <span>{volume}</span>
    </FlexCenter>
  );
};
