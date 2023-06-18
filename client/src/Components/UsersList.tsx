import React, { useContext, useState } from 'react';
import { StateContext } from '../lib';
import { styled } from 'styled-components';
import { IUser } from 'shared';

const UsersListContainer = styled.div`
  position: absolute;
  top: 3rem;
  background-color: whitesmoke;
  border: 1px solid black;
  border-radius: 4px;
  width: 80%;
`;

const UsersButton = styled.button`
  background-color: transparent;
  border-style: none;
  font-size: 1.75rem;
  cursor: pointer;
`;

const UsersBadge = styled.span`
  background-color: red;
  color: white;
  width: 1.25rem;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  border-radius: 50%;
  position: absolute;
  left: 1.9rem;
  top: 0.25rem;
  cursor: pointer;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
`;

export const UsersList: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingName, setEditingName] = useState(false);
  const { state } = useContext(StateContext);
  const { room, user } = state;
  console.log('Current user?', user?.username);

  const mapUsersList = (users: IUser, index: number) => {
    if (users.username !== user?.username)
      return (
        <li key={index}>
          <SpaceBetween>
            <div>
              {users.username}
              {users.isHost && <span title="Host">👑</span>}
            </div>
          </SpaceBetween>
        </li>
      );
  };

  return (
    <>
      <UsersButton onClick={() => setIsOpen(!isOpen)}>👥</UsersButton>
      <UsersBadge onClick={() => setIsOpen(!isOpen)}>{room?.users.length}</UsersBadge>
      {isOpen && (
        <UsersListContainer>
          <ul>
            <li>
              <SpaceBetween>
                {user?.username}
                {user?.isHost && '👑'}
                <button onClick={() => setEditingName(true)} title="Change Name">
                  🖊️
                </button>
              </SpaceBetween>
            </li>
            {room?.users.map(mapUsersList)}
          </ul>
        </UsersListContainer>
      )}
    </>
  );
};
