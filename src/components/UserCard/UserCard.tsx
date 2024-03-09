import { useState } from "react";
import "./style.css";

interface User {
  "first_name": string,
  "last_name": string
}
interface Group {
  "id": number,
  "name": string,
  "closed": boolean,
  "avatar_color"?: string,
  "members_count": number,
  "friends"?: User[]
}

export function UserCard({ closed, name, avatar_color, members_count, friends }: Group) {
  const [isShown, setIsShown] = useState(false)

  const showFriends = () => {
    return (
      <div className="usersList">
        {friends?.map((friend) => {
           const randomId = Math.random() * 1000000
           return(
            <div key={randomId}>
              <a>{friend.first_name} {friend.last_name}</a>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="userCard">
      <div className="userPic" style={{backgroundColor: avatar_color ? avatar_color : ''}} ></div>
      <div className="userInfo">
        <div>{name ? name : ''}</div>
        <div>{closed ? 'Status: closed' : 'Status: open'}</div>
        <div>{members_count ? `Members: ${members_count}` : ''}</div>
        <div className="friends" onClick={() => setIsShown(!isShown)}>{friends ? `Friends: ${friends.length}` : ''}</div>
        {isShown ?
        showFriends()
          :
        null
      }
      </div>
    </div>
  );
}
