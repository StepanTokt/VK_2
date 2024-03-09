import { useState, useEffect } from "react";
import { SearchForm } from "./components/SearchFrom/SearchForm";
import { SearchContext } from "./components/SearchResults/SearchContext";
import { SearchResults } from "./components/SearchResults/SearchResults";
import setContent from './Utils/setContent'
import { mockUsers } from './mockUsers';
import {useHttp} from './hook/hook'

interface GetGroupsResponse {
  result: 1 | 0,
  data?: Group[]
}

interface Group {
  "id": number,
  "name": string,
  "closed": boolean,
  "avatar_color"?: string,
  "members_count": number,
  "friends"?: User[]
}

interface User {
  "first_name": string,
  "last_name": string
}

export default function App() {
  const [users, setUsers] = useState<Group[]>([]); 
  const [valueForSearch, setValueForSearch] = useState<string[]>(['All', 'All', 'All']);
  const {process, setProcess} = useHttp()

  useEffect(() => {
    updateData();
  }, [valueForSearch]);

  const onChangeValue = (value: string[]) => {
    setValueForSearch(value);
  };

  const updateData = () => {
    const getData = new Promise<GetGroupsResponse>((res) =>{
      setProcess('loading')
      setTimeout(() =>{
        if(mockUsers.length == 0){
          setProcess('error')
          return
        }
        const filteredUsers = applyFilters(mockUsers, valueForSearch);
        const result = filteredUsers.length > 0 ? 1 : 0;
        res({ result, data: filteredUsers });
      }, 1000);
    }).then(({ result, data }) => {
        if (result === 0 && (process !== 'loading' || process !== 'waiting')) {
          throw new Error('No data');
        } else {
          onDataLoaded(data); 
          setProcess('confirmed');
        }
      })
      .catch(() => setProcess('noData'));
  };

  const onDataLoaded = (data: Group[]) => {
    setUsers(data)
  }

  const applyFilters = (data: Group[], filters: (string | boolean)[]) => {
    return data.filter(user => {
      const [privateFilter, avatarFilter, friendsFilter] = filters
      return (
        (privateFilter === 'All' || user.closed == privateFilter) &&
        (avatarFilter === 'All' || user.avatar_color === avatarFilter) &&
        (friendsFilter === 'All' || (friendsFilter === 'With friends' ? user.friends : !user.friends))
      );
    });
  };

  return (
    <SearchContext.Provider value={{ users }}>
      <SearchForm onChangeValue={onChangeValue} />
      {setContent(process, <SearchResults />)}
    </SearchContext.Provider>
  );
}
