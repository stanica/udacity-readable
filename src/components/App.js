import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { setCategory, setCategories, setPost, setComments, clearPosts } from '../actions';
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
    const url = `http://localhost:3001/categories`;
    console.log('fetching from url', url);
    fetch(url, { headers: { 'Authorization': 'my-auth'},
                 credentials: 'same-origin'} )
      .then( (res) => { return(res.text()) })
      .then((data) => {
        this.props.categoriesSet(JSON.parse(data).categories);
        this.updatePath();
        this.fetchPosts(this.props.app.category);
      });
  }

  fetchPosts(category){
    this.props.postsClear();
    const postsUrl = `http://localhost:3001/${category ? (category + '/posts') : 'posts'}`;
    console.log('fetching from url', postsUrl);
    fetch(postsUrl, { headers: { 'Authorization': 'my-auth'},
                 credentials: 'same-origin'} )
      .then( (res) => { return(res.text()) })
      .then((data) => {
        this.setState({ postsCount:JSON.parse(data).length });
        JSON.parse(data).sort((x,y) => y.voteScore - x.voteScore).map((post, index) => {
          let commentsUrl = `http://localhost:3001/posts/${post.id}/comments`;
          fetch(commentsUrl, { headers: { 'Authorization': 'my-auth'},
                       credentials: 'same-origin'} )
            .then( (res) => { return(res.text()) })
            .then((comments) => {
              var found = false;
              this.props.app.posts.map((appPost) => {
                if(appPost.id === post.id){
                  found = true;
                }
              });
              if(!found){
                var obj = {
                  key: post.id,
                  comments: JSON.parse(comments)
                }
                this.props.postsSet(post);
                this.props.commentsSet(obj);
              }
            });
        });
      });
  }

  updatePath() {
     this.props.categorySet(this.props.location.pathname.split('/')[1]);
  }

  componentWillUpdate(prevProps, nextState){
    if(prevProps.app.category !== this.props.app.category){
      this.fetchPosts(prevProps.app.category);
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
            postsCount={this.state.postsCount}
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
    categorySet: (data) => dispatch(setCategory(data)),
    categoriesSet: (data) => dispatch(setCategories(data)),
    postsSet: (data) => dispatch(setPost(data)),
    commentsSet: (data) => dispatch(setComments(data)),
    postsClear: () => dispatch(clearPosts())
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
