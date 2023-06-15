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
  text-align: center;
  border-radius: 50%;
  position: absolute;
  left: 1.8rem;
  top: 0.25rem;
`;

export const UsersList: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state } = useContext(StateContext);
  const { room } = state;

  const mapUsersList = (users: IUser, index: number) => {
    return <li key={index}>{users.username}</li>;
  };

  return (
    <>
      <UsersButton onClick={() => setIsOpen(!isOpen)}>👥</UsersButton>
      <UsersBadge>{room?.users.length}</UsersBadge>
      {isOpen && (
        <UsersListContainer>
          <ul>{room?.users.map(mapUsersList)}</ul>
        </UsersListContainer>
      )}
    </>
  );
};
