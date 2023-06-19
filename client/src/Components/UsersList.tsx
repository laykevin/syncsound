import React, { useContext, useState, useRef } from 'react';
import { StateContext } from '../lib';
import { styled } from 'styled-components';
import { IUser } from 'shared';

const UsersListContainer = styled.div`
  display: flex;
  flex-direction: column;
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
const LiPadding = styled.input``;

const NameForm = styled.span`
  display: flex;
  justify-content: space-between;
`;

const UsersLi = styled.span`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
`;

const RowReverse = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const UsersList: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { state, mergeState } = useContext(StateContext);
  const { room, user } = state;
  console.log('Current user?', user?.username);

  const mapUsersList = (roomUser: IUser, index: number) => {
    // if (users.username !== user?.username)
    return (
      <UsersLi key={index} style={{ order: roomUser.username !== user?.username ? '1' : '0' }}>
        <div>
          {roomUser.username}
          {roomUser.isHost && <span title="Host">👑</span>}
        </div>
        {roomUser.username === user?.username && (
          <button onClick={() => setEditingName(true)} title="Change Name">
            🖊️
          </button>
        )}
      </UsersLi>
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

  const handleNameChange: React.FormEventHandler = (event: React.KeyboardEvent) => {
    console.log('change name');
    event.preventDefault();
    if (user?.username && room?.users && typeof nameInputRef.current?.value === 'string') {
      const newName = nameInputRef.current?.value; //TODO: consolidate username source
      const users = room?.users.map((roomUser) => {
        if (roomUser.username === user.username) {
          return {
            ...roomUser,
            username: newName,
          };
        }
        return roomUser;
      });
      const newUser = { ...user, username: newName };
      mergeState({ user: newUser, room: { ...room, users } });
      setEditingName(false);
    }
  };

  const handleUsersButton = () => {
    setIsOpen(!isOpen);
    setEditingName(false);
  };

  const EditName: React.FC = () => {
    return (
      <UsersListContainer style={{ zIndex: '1' }}>
        <form onSubmit={handleNameChange}>
          <NameForm>
            <LiPadding type="text" ref={nameInputRef} autoFocus required placeholder={user?.username}></LiPadding>
            <RowReverse>
              <button type="submit" title="Save">
                ✔️
              </button>
              <button onClick={() => setEditingName(false)} title="Cancel">
                ❌
              </button>
            </RowReverse>
          </NameForm>
        </form>
      </UsersListContainer>
    );
  };

  return (
    <>
      <UsersButton onClick={handleUsersButton}>👥</UsersButton>
      <UsersBadge onClick={handleUsersButton}>{room?.users.length}</UsersBadge>
      {isOpen && (
        <>
          {editingName && <EditName />}
          <UsersListContainer>
            {/* <ul>
            {!editingName ? <UsersLiComponent /> : <EditName />} */}
            {room?.users.map(mapUsersList)}
            {/* </ul> */}
          </UsersListContainer>
        </>
      )}
    </>
  );
};
