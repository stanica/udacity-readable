export const SET_VOTE = 'SET_VOTE';
export const ADD_POST = 'ADD_POST';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const EDIT_POST = 'EDIT_POST';
export const REMOVE_POST = 'REMOVE_POST';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_POST = 'SET_POST';
export const SET_COMMENTS = 'SET_COMMENTS';
export const CLEAR_POSTS = 'CLEAR_POSTS';
export const SET_VOTE_COMMENT = 'SET_VOTE_COMMENT';
export const SET_POSTS_COUNT = 'SET_POSTS_COUNT';

export function setVote (vote){
  return {
    type: SET_VOTE,
    vote
  }
}

export function addPost (post){
  return {
    type: ADD_POST,
    post
  }
}

export function removeComment (comment){
  return {
    type: REMOVE_COMMENT,
    comment
  }
}

export function editPost (post){
  return {
    type: EDIT_POST,
    post
  }
}

export function removePost (post){
  return {
    type: REMOVE_POST,
    post
  }
}

export function editComment (comment){
  return {
    type: EDIT_COMMENT,
    comment
  }
}

export function setCategory (category){
  return {
    type: SET_CATEGORY,
    category
  }
}

export function setCategories (categories){
  return {
    type: SET_CATEGORIES,
    categories
  }
}

export function setPost (post){
  return {
    type: SET_POST,
    post
  }
}

export function setComments (comments){
  return {
    type: SET_COMMENTS,
    comments
  }
}

export function clearPosts (){
  return {
    type: CLEAR_POSTS
  }
}

export function setVoteComment (vote){
  return {
    type: SET_VOTE_COMMENT,
    vote
  }
}

export function setPostsCount (count){
  return {
    type: SET_POSTS_COUNT,
    count
  }
}

export function fetchCategories(category){
  return (dispatch) => {
    dispatch(setCategory(category));
    console.log('fetching from url', 'http://localhost:3001/categories');
    fetch('http://localhost:3001/categories', { headers: { 'Authorization': 'my-auth'},
                 credentials: 'same-origin'} )
      .then( (res) => { return(res.text()) })
      .then((data) => {
        dispatch(setCategories(JSON.parse(data).categories));
      });
  }
}

export function fetchPosts(category){
  return (dispatch, getState) => {
    dispatch(clearPosts());
    const postsUrl = `http://localhost:3001/${category ? (category + '/posts') : 'posts'}`;
    console.log('fetching from url', postsUrl);
    fetch(postsUrl, { headers: { 'Authorization': 'my-auth'},
                 credentials: 'same-origin'} )
      .then( (res) => { return(res.text()) })
      .then((data) => {
        dispatch(setPostsCount(JSON.parse(data).length));
        JSON.parse(data).sort((x,y) => y.voteScore - x.voteScore).map((post, index) => {
          let commentsUrl = `http://localhost:3001/posts/${post.id}/comments`;
          fetch(commentsUrl, { headers: { 'Authorization': 'my-auth'},
                       credentials: 'same-origin'} )
            .then( (res) => { return(res.text()) })
            .then((comments) => {
              var found = false;
              getState().app.posts.map((appPost) => {
                if(appPost.id === post.id){
                  found = true;
                }
              });
              if(!found){
                var obj = {
                  key: post.id,
                  comments: JSON.parse(comments)
                }
                dispatch(setPost(post));
                dispatch(setComments(obj));
              }
            });
        });
      });
  }
}

export function vote(direction, id, type, index){
  return (dispatch) => {
    const url = `http://localhost:3001/${type}/${id}`;
    console.log('fetching from url', url);
    fetch(url,{
                method: 'post',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({option:direction})
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);

        data.index = index;
        if(type === 'posts'){
          dispatch(setVote(data));
        }
        else {
          dispatch(setVoteComment(data));
        }
      });
  }
}

export function createPost(id, body, title, category){
  return (dispatch) => {
    const url = `http://localhost:3001/posts`;
    console.log('fetching from url', url);
    var params = {
      id: id,
      timestamp: Date.now(),
      body: body,
      title: title,
      author: 'user' + Math.floor(Math.random() * 2000) + 1,
      category: category
    }
    fetch(url,{
                method: 'post',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(params)
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);
        dispatch(setPost(data));
      });
  }
}

export function editPostFetch(id, remove, index, body, title){console.log(remove,body, title);
  return (dispatch) => {
    const url = `http://localhost:3001/posts/${id}`;
    console.log('fetching from url', url);
    var params = {
      timestamp: Date.now(),
      body: body,
      title: title
    }
    fetch(url,{
                method: remove ? 'delete' : 'put',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(params)
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);
        data.index = index;
        if(!remove){
          dispatch(editPost(data));
        }
        else {
          dispatch(removePost(data));
        }
      });
  }
}

export function editCommentFetch(id, remove, body, index){
  return (dispatch) => {
    const url = `http://localhost:3001/comments/${id}`;
    console.log('fetching from url', url);
    var params = {
      timestamp: Date.now(),
      body: body
    }
    fetch(url,{
                method: remove ? 'delete' : 'put',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(params)
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);
        data.index = index;
        if(!remove){
          dispatch(editComment(data));
        }
        else {
          dispatch(removeComment(data));
        }
      });
  }
}

export function addCommentFetch(id, comment, parentId){
  return (dispatch, getState) => {
    const url = `http://localhost:3001/comments`;
    console.log('fetching from url', url);
    var body = {
      id: id,
      timestamp: Date.now(),
      body: comment,
      author: 'user' + Math.floor(Math.random() * 2000) + 1,
      parentId: parentId
    }
    fetch(url,{
                method: 'post',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(body)
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);
        getState().comments[data.parentId].push(data);
        var obj = {
          key: data.parentId,
          comments: getState().comments[data.parentId].sort((x,y) => y.voteScore - x.voteScore)
        }
        dispatch(setComments(obj));
      });
  }
}
