import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UserProfilePage() {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userRes = await fetch(`/api/users/${id}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);

        // Check friend status if current user exists
        if (currentUser) {
          const friendRes = await fetch(`/api/friends/${id}/status`);
          if (!friendRes.ok) throw new Error('Failed to check friend status');
          const { isFriend } = await friendRes.json();
          setIsFriend(isFriend);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleAddFriend = async () => {
    try {
      const res = await fetch(`/api/friends/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}` // If using auth
        }
      });

      if (!res.ok) throw new Error('Failed to add friend');
      setIsFriend(true);
    } catch (err) {
      setError(err.message);
      console.error('Add friend error:', err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

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
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Add Friend
            </button>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
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

export default UserProfilePage;