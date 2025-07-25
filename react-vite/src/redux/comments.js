
export const deleteComment = (commentId) => async () => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'}
    });

    if (res.ok) {
        return true;
    }
    return false;
}


export const updateComment = async (commentId, message) => {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (res.ok) return await res.json();

  const errorData = await res.json();
  console.error('Update comment error:', errorData);
  return false;
};

