import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { setPost, setComments, clearPosts, fetchCategories, fetchPosts, setCategory } from '../actions';
import '../App.css';
import Header from './Header.js';
import Posts from './Posts.js';
import Post from './Post.js';
import { withRouter } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      posts: [],
      postsCount: 0
    }
  }
  componentDidMount() {
    this.props.fetchCategories(this.props.location.pathname.split('/')[1]);
    if(this.props.location.pathname === '/'){
      this.props.fetchPosts(this.props.app.category);
    }
  }

  componentWillUpdate(prevProps, nextState){
    if(prevProps.app.category !== this.props.app.category){
      this.props.fetchPosts(prevProps.app.category);
    }
  }

  render() {
    const { categorySet } = this.props;

    return (
      <div>
        <Header
          setCategory={(category) => {categorySet(category)}}
          categories={this.props.app.categories}
        />

        <Route exact path="/" render={() => (
          <Posts
            posts={this.props.app.posts}
            postsCount={this.props.app.postsCount}
          />
        )}/>

        <Route exact path="/:category" render={() => (
          <Posts posts={this.props.app.posts}
          />
        )}/>

      <Route exact path="/:category/:id" render={() => (
          <Post postsClear = {this.props.postsClear}
                commentsSet = {this.props.commentsSet}
          />
        )}/>

      </div>
    );
  }
}

function mapStateToProps ({comments, post, app, categories}){
  return {
    comments,
    post,
    app,
    categories
  }
}

function mapDispatchToProps(dispatch){
  return {
    postsSet: (data) => dispatch(setPost(data)),
    commentsSet: (data) => dispatch(setComments(data)),
    postsClear: () => dispatch(clearPosts()),
    fetchCategories: (props) => dispatch(fetchCategories(props)),
    fetchPosts: (category) => dispatch(fetchPosts(category)),
    categorySet: (category) => dispatch(setCategory(category)),
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
