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
  width: 100%;
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
const LiPadding = styled.li`
  padding: 0.25rem 0;
`;

const UsersLi = styled(LiPadding)`
  display: flex;
  justify-content: space-between;
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
        <LiPadding key={index}>
          {users.username}
          {users.isHost && <span title="Host">👑</span>}
        </LiPadding>
      );
  };

  const UsersLiComponent: React.FC = () => {
    return (
      <UsersLi>
        {user?.isHost ? <span title="Host">{user.username}👑</span> : user?.username}
        <button onClick={() => setEditingName(true)} title="Change Name">
          🖊️
        </button>
      </UsersLi>
    );
  };

  const EditName: React.FC = () => {
    return (
      <form onSubmit={() => setEditingName(false)}>
        <UsersLi>
          <input type="text"></input>
          <div>
            <button onClick={() => setEditingName(false)} title="Cancel">
              ❌
            </button>
            <button type="submit" title="Save">
              ✔️
            </button>
          </div>
        </UsersLi>
      </form>
    );
  };

  return (
    <>
      <UsersButton onClick={() => setIsOpen(!isOpen)}>👥</UsersButton>
      <UsersBadge onClick={() => setIsOpen(!isOpen)}>{room?.users.length}</UsersBadge>
      {isOpen && (
        <UsersListContainer>
          <ul>
            {!editingName ? <UsersLiComponent /> : <EditName />}
            {room?.users.map(mapUsersList)}
          </ul>
        </UsersListContainer>
      )}
    </>
  );
};
