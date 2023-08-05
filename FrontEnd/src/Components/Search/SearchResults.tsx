// src/components/SearchResults.tsx
import React from "react";
import UserCard from "./UserCard";

interface User {
  user_id: number;
  username: string;
  email: string;
}

interface SearchResultsProps {
  users: User[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <UserCard
          key={user.user_id}
          username={user.username}
          email={user.email}
        />
      ))}
    </div>
  );
};

export default SearchResults;
