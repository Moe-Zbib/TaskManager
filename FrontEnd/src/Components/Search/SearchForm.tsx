// src/components/SearchForm.tsx
import React, { useState } from "react";

interface SearchFormProps {
  onSearch: (username: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [username, setUsername] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={handleInputChange}
        placeholder="Enter username..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
