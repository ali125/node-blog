$('.commentForm').on('submit', function (e) {
    e.preventDefault();
    const commentId = $(this).attr("data-comment");
    const postId = $(this).attr("data-post");
    const content = $(this).find('[name="comment"]').val()
    fetch(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            commentId,
        })
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        // window.location.href = `/dashboard/${dataType}`;
    });
});