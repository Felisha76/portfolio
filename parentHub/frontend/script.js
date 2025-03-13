document.addEventListener("DOMContentLoaded", async () => {
    const postList = document.getElementById("post-list");
    const postTemplate = document.getElementById("post-template");
  
    // Load posts from backend - DOESN'T WORK YET
    let posts = [];
    try {
      const response = await fetch('/api/posts');
      posts = await response.json();
    } catch (error) {
      posts = [];
    }
  
    // Save posts to backend - DOESN'T WORK YET
    async function savePosts() {
      try {
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(posts)
        });
      } catch (error) {
        console.log('Error saving posts:', error);
      }
    }
  
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
        savePosts();
      });
  
      dislikeBtn.addEventListener("click", () => {
        post.dislikes++;
        dislikeCount.textContent = post.dislikes;
        savePosts();
      });
  
      const commentList = clone.querySelector(".comment-list");
      const commentInput = clone.querySelector(".comment-input");
      const addCommentBtn = clone.querySelector(".add-comment");
  
      addCommentBtn.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
          const newComment = {
            author: "Your Name",
            timestamp: new Date().toLocaleString(),
            text: commentText,
            likes: 0,
            dislikes: 0,
            replies: []
          };
  
          post.comments.push(newComment);
  
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment");
          commentDiv.innerHTML = `
            <div class="comment-header">${newComment.author} · ${newComment.timestamp}</div>
            <div class="comment-body">${newComment.text}</div>
            <div class="comment-actions">
              <button class="comment-like">👍 <span>${newComment.likes}</span></button>
              <button class="comment-dislike">👎 <span>${newComment.dislikes}</span></button>
            </div>
          `;
  
          const commentLikeBtn = commentDiv.querySelector(".comment-like");
          const commentDislikeBtn = commentDiv.querySelector(".comment-dislike");
  
          commentLikeBtn.addEventListener("click", () => {
            newComment.likes++;
            commentLikeBtn.querySelector("span").textContent = newComment.likes;
            savePosts();
          });
  
          commentDislikeBtn.addEventListener("click", () => {
            newComment.dislikes++;
            commentDislikeBtn.querySelector("span").textContent = newComment.dislikes;
            savePosts();
          });
  
          commentList.appendChild(commentDiv);
          commentInput.value = '';
          savePosts();
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
          savePosts();
        });
  
        commentDislikeBtn.addEventListener("click", () => {
          comment.dislikes++;
          commentDislikeBtn.querySelector("span").textContent = comment.dislikes;
          savePosts();
        });
  
        commentList.appendChild(commentDiv);
      });
  
      postList.insertBefore(clone, postList.firstChild);
    }
  
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
      posts.unshift(newPost);
      createAndAppendPost(newPost);
      savePosts();
    });
  
    // Load initial posts
    posts.forEach(post => createAndAppendPost(post));
  });
  