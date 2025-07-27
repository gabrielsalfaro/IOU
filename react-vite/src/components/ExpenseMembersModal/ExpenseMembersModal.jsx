import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchFriends} from "../../redux/friends";
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal";
import './ExpenseMembersModal.css';


function ExpenseMembersModal() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [friendSearch, setFriendSearch] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const friends = useSelector(state => Object.values(state.friends.friends));
  //const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

  const nextModal = () => {
    setModalContent(
      <CreateExpenseModal selectedFriends={selectedFriends}/>
    )
  }

  const filteredFriends = friends.filter(friendObject => {
    const friendData = friendObject.friend;
    const searchTerm = friendSearch.toLowerCase();
    return (
      friendData?.firstname.toLowerCase().includes(searchTerm) ||
      friendData?.lastname.toLowerCase().includes(searchTerm) ||
      friendData?.username.toLowerCase().includes(searchTerm)
    );
  });

  const handleFriendSelect = (friendId) => {
    if (selectedFriends?.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  }


  return (
    <div className="expense-members-modal">
      <h2>Which friends to split this expense?</h2>

      <div className="friends-search-container">
        <input
          type="text"
          value={friendSearch}
          onChange={(e) => setFriendSearch(e.target.value)}
          placeholder="Search friends..."
          className="friend-search-box"
        />
      </div>

      <div className="friends-list">
        {filteredFriends?.length > 0 ? ( //if a friend was found
          filteredFriends?.map(({ id, friend }) => (
            <div
              key={id}
              //class name specifies a selected/non selected so we can edit css
              className={`friend-line-item ${selectedFriends.includes(friend.id) ? "selected" : ""}`}
              onClick={() => handleFriendSelect(friend.id)}
            >
              <div className="friend-line-info">
                <span className="friend-fullname">{friend.firstname} {friend.lastname}</span>
                <span className="friend-username"><em>(@{friend.username})</em></span>
                {selectedFriends.includes(friend.id) && (
                  <span>✓</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-friends">No friends found</p>
        )}
      </div>

      <div className="expense-members-button-container">
        {selectedFriends.length === 0 && (
          <p className="select-friend-message"><em>Select at least one friend to split the expense with!</em></p>
        )}
        <button
          className="members-next-button"
          onClick={nextModal}
          disabled={selectedFriends.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ExpenseMembersModal;
