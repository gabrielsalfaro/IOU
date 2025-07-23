import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UserProfile() {
  const { id } = useParams(); // I believe this gets the user id from the URL
  const currentUser = useSelector((state) => state.session.user);
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    // I believe this fetches the user being viewed
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));

    // I believe this checks if they're already friends
    fetch(`/api/friends/${id}/is-friend`)
      .then(res => res.json())
      .then(data => setIsFriend(data.isFriend));
  }, [id]);

  const handleAddFriend = async () => {
    const res = await fetch(`/api/friends/${id}`, {
      method: "POST"
    });

    if (res.ok) {
      setIsFriend(true); // I believe this updates the friend status
    }
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="font-bold text-gray-600 mb-2">FRIENDS</h2>
        <ul className="space-y-2">
          {user.friends?.slice(0, 3).map((friend) => (
            <li key={friend.id} className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>{friend.username}</span>
            </li>
          ))}
        </ul>
        <a href={`/users/${id}/friends`} className="text-sm font-bold mt-4 block">
          View All Friends...
        </a>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">User Profile</h1>
          {!isFriend && currentUser?.id !== user.id && (
            <button
              onClick={handleAddFriend}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Add Friend
            </button>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-400 mt-2">
            Member since {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </p>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
