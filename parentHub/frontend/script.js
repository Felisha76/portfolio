document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("post-list");
    const postTemplate = document.getElementById("post-template");
  
    const examplePosts = [
      {
        group: "Group 01",
        author: "Post Owner's name",
        timestamp: "2025-03-13 07:45",
        text: "Example post",
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
  
    const newPostBtn = document.createElement("button");
    newPostBtn.textContent = "New Post";
    newPostBtn.classList.add("new-post-btn");
    postList.parentElement.insertBefore(newPostBtn, postList);
  
    newPostBtn.addEventListener("click", () => {
      const newPost = {
        group: "Your Group",
        author: "Your Name",
        timestamp: new Date().toLocaleString(),
        text: prompt("Enter your post text:"),
        image: "",
        likes: 0,
        dislikes: 0,
        comments: []
      };
      createAndAppendPost(newPost);
    });
  
    function createAndAppendPost(post) {
      const clone = postTemplate.content.cloneNode(true);
      clone.querySelector(".group-name").textContent = post.group;
      clone.querySelector(".author").textContent = post.author;
      clone.querySelector(".timestamp").textContent = post.timestamp;
      clone.querySelector(".text").textContent = post.text;
  
      const img = clone.querySelector(".post-image");
      if (post.image) {
        img.src = post.image;
        img.style.display = "block";
      } else {
        img.style.display = "none";
      }
  
      const likeBtn = clone.querySelector(".like-btn");
      const dislikeBtn = clone.querySelector(".dislike-btn");
      const likeCount = likeBtn.querySelector("span");
      const dislikeCount = dislikeBtn.querySelector("span");
  
      likeCount.textContent = post.likes;
      dislikeCount.textContent = post.dislikes;
  
      likeBtn.addEventListener("click", () => {
        post.likes++;
        likeCount.textContent = post.likes;
      });
  
      dislikeBtn.addEventListener("click", () => {
        post.dislikes++;
        dislikeCount.textContent = post.dislikes;
      });
  
      const commentList = clone.querySelector(".comment-list");
      const commentInput = clone.querySelector(".comment-input");
      const addCommentBtn = clone.querySelector(".add-comment");
  
      addCommentBtn.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment");
          commentDiv.innerHTML = `
            <div class="comment-header">Your Name · ${new Date().toLocaleString()}</div>
            <div class="comment-body">${commentText}</div>
            <div class="comment-actions">
              <button class="comment-like">👍 <span>0</span></button>
              <button class="comment-dislike">👎 <span>0</span></button>
            </div>
          `;
  
          const commentLikeBtn = commentDiv.querySelector(".comment-like");
          const commentDislikeBtn = commentDiv.querySelector(".comment-dislike");
          let commentLikes = 0;
          let commentDislikes = 0;
  
          commentLikeBtn.addEventListener("click", () => {
            commentLikes++;
            commentLikeBtn.querySelector("span").textContent = commentLikes;
          });
  
          commentDislikeBtn.addEventListener("click", () => {
            commentDislikes++;
            commentDislikeBtn.querySelector("span").textContent = commentDislikes;
          });
  
          commentList.appendChild(commentDiv);
          commentInput.value = '';
        }
      });
  
      post.comments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
          <div class="comment-header">${comment.author} · ${comment.timestamp}</div>
          <div class="comment-body">${comment.text}</div>
          <div class="comment-actions">
            <button class="comment-like">👍 <span>${comment.likes}</span></button>
            <button class="comment-dislike">👎 <span>${comment.dislikes}</span></button>
          </div>
        `;
  
        const commentLikeBtn = commentDiv.querySelector(".comment-like");
        const commentDislikeBtn = commentDiv.querySelector(".comment-dislike");
  
        commentLikeBtn.addEventListener("click", () => {
          comment.likes++;
          commentLikeBtn.querySelector("span").textContent = comment.likes;
        });
  
        commentDislikeBtn.addEventListener("click", () => {
          comment.dislikes++;
          commentDislikeBtn.querySelector("span").textContent = comment.dislikes;
        });
  
        commentList.appendChild(commentDiv);
      });
  
      postList.insertBefore(clone, postList.firstChild);
    }
  
    examplePosts.forEach(post => createAndAppendPost(post));
  });
  