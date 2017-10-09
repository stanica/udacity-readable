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
