// src/components/UserCard.tsx
import React from "react";

interface UserCardProps {
  username: string;
  email: string;
}

const UserCard: React.FC<UserCardProps> = ({ username, email }) => {
  return (
    <div>
      <h3>{username}</h3>
      <p>Email: {email}</p>
    </div>
  );
};

export default UserCard;
