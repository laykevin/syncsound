import React from 'react';
import styled from 'styled-components';

const FlexColCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  font-family: sans-serif;
  color: darkgreen;
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
      <Heading>SyncSound</Heading>
      <Panel>
        <h4>Welcome</h4>
        <form action="http://localhost:3000/room" method="POST">
          <label htmlFor="room-input">Room:</label>
          <input id="room-input" name="room" type="text" required />
          <button type="submit">Join</button>
        </form>
      </Panel>
    </FlexColCenter>
  );
};
