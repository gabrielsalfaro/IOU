
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