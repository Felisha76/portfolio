document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("post-list");
  const postTemplate = document.getElementById("post-template");

  const examplePosts = [
    {
      group: "Group 01",
      author: "Post Owner's name",
      timestamp: "2025-03-13 07:45",
      text: "example post",
      image: "https://via.placeholder.com/400x200",
      likes: 2,
      dislikes: 0,
      comments: [
        {
          author: "Comment Owner's name",
          timestamp: "2025-03-13 08:00",
          text: "Answer text",
          likes: 1,
          dislikes: 0,
          replies: []
        }
      ]
    },
 ];

  examplePosts.forEach(post => {
    const clone = postTemplate.content.cloneNode(true);
    clone.querySelector(".group-name").textContent = post.group;
    clone.querySelector(".author").textContent = post.author;
    clone.querySelector(".timestamp").textContent = post.timestamp;
    clone.querySelector(".text").textContent = post.text;

    const img = clone.querySelector(".post-image");
    if (post.image) {
      img.src = post.image;
      img.style.display = "block";
    }

    const likeBtn = clone.querySelector(".like-btn span");
    const dislikeBtn = clone.querySelector(".dislike-btn span");
    likeBtn.textContent = post.likes;
    dislikeBtn.textContent = post.dislikes;

    const commentList = clone.querySelector(".comment-list");
    post.comments.forEach(comment => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");
      commentDiv.innerHTML = `
        <div class="comment-header">${comment.author} · ${comment.timestamp}</div>
        <div class="comment-body">${comment.text}</div>
        <div class="comment-actions">
          <button>👍 ${comment.likes}</button>
          <button>👎 ${comment.dislikes}</button>
        </div>
      `;
      commentList.appendChild(commentDiv);
    });

    postList.appendChild(clone);
  });
});
