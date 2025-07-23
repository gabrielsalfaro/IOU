const GET_FRIENDS = 'friends/GET_FRIENDS';
const GET_PENDNG_FRIENDS = 'friends/GET_PENDING_FRIENDS';


const loadFriends = (friends) => ({ 
    type: GET_FRIENDS, 
    friends 
});
const loadPending = (pending) => ({ 
    type: GET_PENDNG_FRIENDS, 
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

    case GET_PENDNG_FRIENDS: {
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