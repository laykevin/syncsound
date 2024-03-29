import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { StateContext, SocketController } from '../lib';
import { ISound, SoundOrigin, ToServerEvents } from 'shared';

const PlaylistContainer = styled.div`
  padding: 1rem 1rem 0;
  margin: 1rem;
  height: 75vh;
  width: 16rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #ffffff;
`;

const BlockBold = styled.div`
  font-weight: bold;
`;

export const Playlist: React.FC = () => {
  const { state } = useContext(StateContext);
  const { socket, room } = state;
  const user = SocketController.getCurrentUser(state);

  const handleSend: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!room || !user) return console.warn('<Playlist>: Room or user not found', state, event);
    const form = event.target as EventTarget & HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries<string>(formData.entries() as Iterable<readonly [PropertyKey, string]>);
    const sound = extractSoundData(formJson.sound);
    if (!sound) return;
    socket.emit(ToServerEvents.ssplaylistAdd, sound);
    form.reset();
    console.log('<Playlist>:', event, state, formJson, sound);
  };

  const extractSoundData = (embedCode: string): ISound | null => {
    if (!room?.roomName) {
      console.warn('extractSoundData: roomName not found', state, embedCode);
      return null;
    }
    if (!user?.username) {
      console.warn('extractSoundData: username not found', state, embedCode);
      return null;
    }

    let src = ''; //TODO: HTML sanitization
    const srcAttrStart = embedCode.indexOf('src="');
    if (srcAttrStart > 0) {
      const srcStart = srcAttrStart + 5;
      const srcEnd = embedCode.indexOf('"', srcStart); //exclusive
      src = srcEnd > 0 ? embedCode.substring(srcStart, srcEnd) : '';
    }

    if (!src) {
      console.warn('extractSoundData: Sound src not found', state, embedCode);
      return null;
    }

    let title = 'Unknown Track';
    const titleAttrStart = embedCode.indexOf('title="');
    if (titleAttrStart > 0) {
      const titleStart = titleAttrStart + 7;
      const titleEnd = embedCode.indexOf('"', titleStart); //exclusive
      title = titleEnd > 0 ? embedCode.substring(titleStart, titleEnd) : '';
    }

    const origin = src.includes(SoundOrigin.SC) ? SoundOrigin.SC : SoundOrigin.YT;

    let title2 = '';
    const title2AttrStart = embedCode.lastIndexOf('title="');
    if (origin === SoundOrigin.SC && title2AttrStart > 0) {
      const titleStart = title2AttrStart + 7;
      const titleEnd = embedCode.indexOf('"', titleStart); //exclusive
      title2 = titleEnd > 0 ? embedCode.substring(titleStart, titleEnd) : '';
    }

    const addedBy = user.username;
    const { roomName } = room;

    if (origin === SoundOrigin.YT && !src.includes(SoundOrigin.YT)) console.warn('Unknown sound origin');
    return { src, title, title2, origin, addedBy, roomName };
  };

  const mapPlaylist = (sound: ISound, index?: number): JSX.Element => {
    return (
      <div key={index}>
        <div>{sound.title}</div>
        <small>{sound.title2}</small>
      </div>
    );
  };

  return (
    <div>
      <PlaylistContainer>
        <div>
          <div>
            <BlockBold>Now Playing</BlockBold>
            {room?.playlist && room.playlist.length ? mapPlaylist(room.playlist[0]) : <div>Add a sound to begin!</div>}
          </div>
          <div>
            <BlockBold>Up Next</BlockBold>
            {room?.playlist && room.playlist.length > 1 && room.playlist.slice(1).map(mapPlaylist)}
          </div>
        </div>
        <form onSubmit={handleSend}>
          <input type="text" name="sound" placeholder="Embed code..." required></input>
          <button type="submit">Queue</button>
        </form>
      </PlaylistContainer>
    </div>
  );
};
