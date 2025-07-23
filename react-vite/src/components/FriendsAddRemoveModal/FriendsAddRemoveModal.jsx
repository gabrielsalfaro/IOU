import { useState } from "react";
import { useModal } from "../../context/Modal";
import './FriendsAddRemoveModal.css';

function FriendsAddRemoveModal() {
  const { closeModal } = useModal();

  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrors({});
    setSearchResult(null);
    setLoading(true);

    const res = await fetch(`/api/users/search?username=${username}`);
    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setSearchResult(data.user);
    } else {
      setErrors({ search: data.message || "User not found" });
    }
  };

  const handleSendRequest = async () => {
    setErrors({});
    const res = await fetch(`/api/friends/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId: searchResult.id })
    });

    const data = await res.json();

    if (res.ok) {
      closeModal(); // Or show a success message?
    } else {
      setErrors({ request: data.message || "Could not send request" });
    }
  };

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Add a Friend</h1>
        <form onSubmit={handleSearch} className="friend-search-form">
          <label>
            Search by username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter a username"
            />
            <button type="submit" className="friend-add-search-button">
            {loading ? "Searching..." : "Search"}
            </button>
          </label>
          
        </form>
        {errors.search && <p className="error-message">{errors.search}</p>}

        {searchResult && (
          <div className="search-result">
            <center><p className="search-result-username">
              <strong>{searchResult.firstname}{' '}{searchResult.lastname} (@{searchResult.username})</strong>
            </p></center>
            <center><button onClick={handleSendRequest} className="friend-send-request-button">
              Send Friend Request
            </button></center>
            {errors.request && <p className="error-message">{errors.request}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsAddRemoveModal;
