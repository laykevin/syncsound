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
        <label>Room:</label>
        <input />
        <label>Name:</label>
        <input />
        <div>
          <button>Create Room</button>
          <button>Join Room</button>
        </div>
      </Panel>
    </FlexColCenter>
  );
};
