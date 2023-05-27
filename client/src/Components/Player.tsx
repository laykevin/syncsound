import React, { useState, useEffect } from 'react';

interface IVideoData {
  src: string;
  title: string;
}

export const Player: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [videoData, setVideoData] = useState<IVideoData>({ src: '', title: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const $embedInput = document.getElementById('player-input') as HTMLInputElement;
    const embedCode = $embedInput.value;
    if (embedCode) {
      setUserInput(embedCode);
      $embedInput.value = '';
    }
  };

  useEffect(() => {
    if (!userInput) return;
    let src: string = '';
    let title: string = '';

    const srcAttrStart = userInput.indexOf('src="');
    if (srcAttrStart > 0) {
      const srcStart = srcAttrStart + 5;
      const srcEnd = userInput.indexOf('"', srcStart); //exclusive
      src = srcEnd > 0 ? userInput.substring(srcStart, srcEnd) : '';
    }

    const titleAttrStart = userInput.indexOf('title="');
    if (titleAttrStart > 0) {
      const titleStart = titleAttrStart + 5;
      const titleEnd = userInput.indexOf('"', titleStart); //exclusive
      title = titleEnd > 0 ? userInput.substring(titleStart, titleEnd) : '';
    }

    setVideoData({ src, title });
  }, [userInput]);

  return (
    <>
      <div id="player-container">
        {videoData.src && (
          <iframe
            width={1520 / 2}
            height={594 / 4}
            src={videoData.src}
            title={videoData.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={false}
          ></iframe>
        )}
      </div>
      <form id="form" onSubmit={handleSubmit}>
        <label htmlFor="player-input">Embed Code</label>
        <input type="text" id="player-input"></input>
        {/* <textarea name="embed-input" id="embed-input" cols={50} rows={3} style={{ resize: 'none' }}></textarea> */}
        <button type="submit">Add</button>
      </form>
    </>
  );
};
