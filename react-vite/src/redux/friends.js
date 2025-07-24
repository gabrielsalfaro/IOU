const GET_FRIENDS = 'friends/GET_FRIENDS';
const GET_PENDING_FRIENDS = 'friends/GET_PENDING_FRIENDS';


const loadFriends = (friends) => ({ 
    type: GET_FRIENDS, 
    friends 
});
const loadPending = (pending) => ({ 
    type: GET_PENDING_FRIENDS, 
    pending 
});


export const fetchFriends = () => async (dispatch) => {
  const res = await fetch('/api/friends/');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadFriends(data.friends));
  }
};

export const fetchPendingFriends = () => async (dispatch) => {
  const res = await fetch('/api/friends/pending');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadPending(data.pending));
  }
};

export const acceptFriend = (friendId) => async (dispatch) => {
  const res = await fetch(`/api/friends/accept/${friendId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) {
    dispatch(fetchPendingFriends());
    dispatch(fetchFriends());
    return true;
  }
  return false;
};

export const declineFriend = (friendId) => async (dispatch) => {
  const res = await fetch(`/api/friends/decline/${friendId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) {
    dispatch(fetchPendingFriends());
    return true;
  }
  return false;
};



const initialState = {
  friends: {},
  pending: {}
};


export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FRIENDS: {
      const newFriends = {};
      action.friends.forEach((friend) => {
        newFriends[friend.id] = friend;
      });
      return { ...state, friends: newFriends };
    }

    case GET_PENDING_FRIENDS: {
      const newPending = {};
      action.pending.forEach((friend) => {
        newPending[friend.id] = friend;
      });
      return { ...state, pending: newPending };
    }

    default:
      return state;
  }
}