import { combineReducers } from 'redux'

import {
  SET_VOTE,
  ADD_POST,
  REMOVE_COMMENT,
  EDIT_POST,
  REMOVE_POST,
  EDIT_COMMENT,
  SET_CATEGORY,
  SET_CATEGORIES,
  SET_POST,
  SET_COMMENTS,
  CLEAR_POSTS,
  SET_VOTE_COMMENT
} from '../actions';

const initialState = {
  category: '',
  categories: [],
  posts: []
}

function comments (state = [], action){
  const { comment, comments, vote } = action;
  switch(action.type){
    case REMOVE_COMMENT:
    return {
      ...state,
      [comment.parentId]: state[comment.parentId].filter(
        (item) => item.id !== comment.id
      )
    }

    case EDIT_COMMENT:
      return {
        ...state,
        [comment.parentId]: state[comment.parentId].map(
          (commentItem, n) => n === comment.index ? { ...commentItem, body: comment.body }
                                            : commentItem
        )
      }

    case SET_COMMENTS:
      return {
        ...state,
        [comments.key]: comments.comments
      }

    case SET_VOTE_COMMENT:
      return {
        ...state,
        [vote.parentId]: state[vote.parentId].map(
          (comment, n) => n === vote.index ? { ...comment, voteScore: vote.voteScore }
                                            : comment
        )
      }

    default:
      return state;
  }
}

function app (state = initialState, action){
  const { category, categories, post, vote } = action;
  switch (action.type){
    case SET_CATEGORY:
      return {
        ...state,
        category
      };

    case SET_CATEGORIES:
      return {
        ...state,
        categories
      }

    case EDIT_POST:
      return {
        ...state,
        posts: state.posts.map(
          (postItem, n) => n === post.index ? { ...postItem, body: post.body, title: post.title}
                                            : postItem
        )
      }

    case ADD_POST:
      return {

      }

    case SET_POST:
    return {
      ...state,
      posts: [...state.posts, post]
    }

    case CLEAR_POSTS:
      return {
        ...state,
        posts: []
      }

    case REMOVE_POST:
      return {
        ...state,
        posts: state.posts.filter(
          postItem => postItem.id !== post.id
        )
      }

    case SET_VOTE:
      return{
        ...state,
        posts: state.posts.map(
          (post, n) => n === vote.index ? { ...post, voteScore: vote.voteScore }
                                        : post
        )
      }

    default:
      return state;
  }
}

export default combineReducers({
  comments,
  app
});
