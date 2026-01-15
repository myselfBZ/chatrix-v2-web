import { useState, useEffect } from 'react';
import { searchUser, type SearchUserResult } from '../../api/api';

export const useUserSearch = (query: string, token: string) => {
  const [results, setResults] = useState<SearchUserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await searchUser({ token, query});
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, token]);

  return { results, isSearching };
};