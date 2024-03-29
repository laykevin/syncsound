import React from 'react';
import styled from 'styled-components';

const FlexColCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  margin: 0;
  margin-bottom: 4rem;
`;

const Panel = styled(FlexColCenter)`
  border: 1px solid black;
  border-radius: 4px;
  padding: 1rem;
`;

export const Start: React.FC = () => {
  return (
    <FlexColCenter>
      <Heading>🔁SyncSound🎵</Heading>
      <Panel>
        <h4>Welcome</h4>
        <form action="/" method="GET">
          <label htmlFor="room">Room:</label>
          <input id="room" name="room" type="text" required />
          <button type="submit">Join</button>
        </form>
      </Panel>
    </FlexColCenter>
  );
};
