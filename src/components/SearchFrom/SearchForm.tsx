import { useEffect, useState } from "react";
import "./styles.css";
import { useContext } from "react";
import { SearchContext } from "../SearchResults/SearchContext";


export function SearchForm(props) {
  const [value, setValue] = useState<(string | boolean)[]>(['All', 'All', 'All']);
  const { users } = useContext(SearchContext);
  const [availableAvatarColors, setAvailableAvatarColors] = useState<string[]>([]);
  const [colorsLoaded, setColorsLoaded] = useState(false)

  useEffect(() => {
    if (users.length > 0 && !colorsLoaded) { 
      const colors = Array.from(new Set(users.map(user => user.avatar_color))).filter(Boolean);
      setAvailableAvatarColors(colors);
      setColorsLoaded(true); 
    }
  }, [users,colorsLoaded]);

  useEffect(() => {
    props.onChangeValue(value);
  }, [value, props]);

  const handlePrivateFilter = (option: string | boolean) => {
    setValue(prevState => {
      const newState = [...prevState];
      newState[0] = option === "All" ? option : option; 
      return newState;
    });
  };

  const handleAvatarFilter = (option: string) => {
    setValue(prevState => {
      const newState = [...prevState];
      newState[1] = option;
      return newState;
    });
  };

  const handleFriendsFilter = (option: string) => {
    setValue(prevState => {
      const newState = [...prevState];
      newState[2] = option;
      return newState;
    });
  };

  return (
    <div className="searchForm">
      <h1>FILTERING</h1>
      <div className="private">
        <p>Private:</p>
        <button onClick={() => handlePrivateFilter("All")}>All</button>
        <button onClick={() => handlePrivateFilter(false)}>Open</button> 
        <button onClick={() => handlePrivateFilter(true)}>Closed</button> 
      </div>
      <div className="avatar">
        <p>Avatar color:</p>
        <select onChange={(e) => handleAvatarFilter(e.target.value)}>
          <option value="All">All</option>
          {availableAvatarColors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      <div className="friends">
        <p>Friends</p>
        <button onClick={() => handleFriendsFilter("All")}>All</button>
        <button onClick={() => handleFriendsFilter("With friends")}>With friends</button>
        <button onClick={() => handleFriendsFilter("Without friends")}>Without friends</button>
      </div>
    </div>
  );
}
