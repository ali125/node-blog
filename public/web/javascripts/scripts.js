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
        // $('#page').prepend(`<div class="alert alert-success">${res.message}</div>`);
        // $('#comments').prepend(`
        //     <li class="comments__item"><span class="comments__item-comment"><img class="comments__item-avatar" src="/web/images/man.png"><span class="comments__item-body"><span class="comments__item-info"><span class="comments__item-name">Morti Al</span><span class="comments__item-time">3 minutes</span></span><span class="comments__item-content">ddfdf</span><span class="comments__item-actions"><span class="comments__item-action replyBtn">Reply</span></span><form class="form__search form__controller comments__reply-form" data-form="comment" data-post="building-micro-front-end" data-comment="13" method="POST"><input class="form__input" type="text" autocomplete="off" name="comment" placeholder="Reply to Morti Al"><button class="form__button comments__reply-btn">Post</button></form></span></span></li>
        // `);
        // $(this).find('[name="comment"]').val('');
        // console.log(res);
        window.location.reload();
    });
});


$('.replyBtn').on('click', function() {
    const form = $(this).parent().siblings('.comments__reply-form');
    const hasClass = $(form).hasClass('comments__reply-form--show');
    $('.comments__reply-form.comments__reply-form--show').removeClass('comments__reply-form--show');
  
    if (!hasClass) {
        $(form).addClass('comments__reply-form--show');
    }
});