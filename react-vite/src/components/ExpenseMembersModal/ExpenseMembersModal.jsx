import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchFriends} from "../../redux/friends";
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal";


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
    //need to add error when user does not select any friends
    //if(selectedFriends.length === 0)

    setModalContent(
      <CreateExpenseModal selectedFriends={selectedFriends}/>
    )
  }

  const filteredFriends = friends.filter(friendObject => {
    const friendData = friendObject.friend;
    const searchTerm = friendSearch.toLowerCase();
    return (
      friendData.firstname.toLowerCase().includes(searchTerm) ||
      friendData.lastname.toLowerCase().includes(searchTerm) ||
      friendData.username.toLowerCase().includes(searchTerm)
    );
  });

  const handleFriendSelect = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
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
              className={`friend-line-item ${selectedFriends.includes(id) ? "selected" : ""}`}
              onClick={() => handleFriendSelect(id)}
            >
              <div className="friend-line-info">
                {friend.profile_img && ( //see if there is a profile img
                  <img
                    src={friend.profile_img}
                    className="friend-photo"
                  />
                )}
                <span>{friend.firstname} {friend.lastname}</span>
                <span className="friend-username">{friend.username}</span>
                {selectedFriends.includes(id) && (
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
