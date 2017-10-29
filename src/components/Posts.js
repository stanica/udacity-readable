import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPost, clearPosts, createPost, editPostFetch } from '../actions';
import Vote from './Vote.js';
const uuid = require ('uuid/v1');
const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const DropdownButton = require('react-bootstrap').DropdownButton;
const MenuItem = require('react-bootstrap').MenuItem;
const Button = require('react-bootstrap').Button;
const Modal = require('react-bootstrap').Modal;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'Sort by...',
      sort: -1,
      newPost: false,
      newPostTitle: '',
      newPostBody: '',
      selectedCategory: 'Choose a category...',
      editingPost : false,
      editedPostTitle: '',
      editingPostId: ''
    }
  }

  componentDidMount(){
    if(this.props.app.category){
      this.setState({ selectedCategory: this.props.app.category });
    }
  }

  addPost(){
    if(this.state.newPostBody.length > 0 && this.state.newPostTitle.length > 0 && this.state.selectedCategory !== 'Choose a category...'){
      const id = uuid();
      this.props.createPost(id, this.state.newPostBody, this.state.newPostTitle, this.state.selectedCategory);
      this.setState({ newPostTitle: '', newPostBody: '' })
      this.close();
    }
    else {
      window.alert('Your must fill in the Title and Body fields and selecte a category for the post');
    }
  }

  editPost(post, id, index, remove){
    this.props.app.posts.map(
      (postItem, n) => {
        if(postItem.id === id){
          index = n;
        }
      }
    );
    this.setState({editingPost:false});
    this.props.editPost(id, remove, index, this.state.editedPostBody, this.state.editedPostTitle);
    if(remove){
      this.props.history.push('/');
    }
  }

  select(val){
    this.setState({ selectedCategory: val });
  }

  close() {
    this.setState({ newPost: false });
  }

  open() {
    if(this.props.app.category){
      this.setState({ selectedCategory: this.props.app.category });
    }
    this.setState({ newPost: true });
  }

  sort(prop){
    this.setState({selected:prop[0].toUpperCase() + prop.slice(1,prop.length)})
    if (prop === 'time'){
      this.props.app.posts.sort((x,y) => {
        return (y.timestamp - x.timestamp) * this.state.sort;
      })
    }
    else {
      this.props.app.posts.sort((x,y) => {
        return (y.voteScore - x.voteScore) * this.state.sort;
      });
    }
    this.setState({sort: this.state.sort * -1});
    this.props.postsClear();
    this.props.app.posts.map((post) => {
      this.props.postsSet(post);
    })
  }

  render(){
    return (
      <div>
        <Grid>
          <DropdownButton onSelect={(val) => this.sort(val)} bsStyle='default' title={this.state.selected} key='1' id='1'>
            <MenuItem eventKey="votes">Votes</MenuItem>
            <MenuItem eventKey="time">Time</MenuItem>
          </DropdownButton>
          <Button onClick={() => this.open()} bsStyle="success" className={"pull-right"}>New Post</Button>

          <Modal show={this.state.newPost} onHide={() => this.close()}>
            <Modal.Header>
              <Modal.Title>Add a new post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='title-box-container'><input value={this.state.newPostTitle} onChange={(event)=>this.setState({newPostTitle:event.target.value})} className='new-post-box title' placeholder="Title"></input></div>
              <div className='title-box-container'><textarea value={this.state.newPostBody} onChange={(event)=>this.setState({newPostBody:event.target.value})} className='new-post-box body' placeholder="Body"></textarea></div>
              <div>
                <DropdownButton onSelect={(val) => this.select(val)} bsStyle='default' title={this.state.selectedCategory} key='2' id='2'>
                  {this.props.app.categories.map(
                    (category, n) => (
                      <MenuItem key={n} eventKey={category.name}>{category.name}</MenuItem>
                    )
                  )}
                </DropdownButton>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.close()}>Cancel</Button>
              <Button bsStyle='success' onClick={() => this.addPost()}>Submit</Button>
            </Modal.Footer>
          </Modal>

          {this.props.posts && this.props.posts.map((post, index) => (
          <Row key={post.id} className='show-grid'>
            <Col xs={2} sm={1}>
              <Vote postId={post.id} score={post.voteScore} index={index} type='posts' />
            </Col>
            <Col className='flex-center' xs={10} sm={11}>
              {this.state.editingPost  && this.state.editingPostId === post.id ?
                (<input style={{'width':'350px'}} value={this.state.editedPostTitle} onChange={(event)=>this.setState({editedPostTitle:event.target.value})}></input>)
                :
                (<Link to={'/' + post.category + '/' + post.id}>{post.title}</Link>)
              }
              {this.state.editingPost && this.state.editingPostId === post.id ?
                (<div className='muted'>{post.voteScore} points by {post.author} <FormattedRelative value={post.timestamp} /> | {this.props.comments[post.id] && this.props.comments[post.id].length || 0} comments | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, false)}>save</a> | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, true)}>delete</a></div>)
                :
                (<div className='muted'>{post.voteScore} points by {post.author} <FormattedRelative value={post.timestamp} /> | {this.props.comments[post.id] && this.props.comments[post.id].length || 0} comments | <a className='clickable' onClick={() => this.setState({editingPost:true, editedPostTitle:post.title, editingPostId:post.id})}>edit</a> | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, true)}>delete</a></div>)
              }
            </Col>
          </Row>
          ))}
          {this.props.posts.length === 0 && (
            <h3>Nothing to see here!</h3>
          )}
        </Grid>
      </div>
    )
  }
}

function mapStateToProps ({comments, app}){
  return {
    comments,
    app
  }
}

function mapDispatchToProps(dispatch){
  return {
    postsSet: (data) => dispatch(setPost(data)),
    postsClear: () => dispatch(clearPosts()),
    editPost: (id, remove, index, body, title) => dispatch(editPostFetch(id, remove, index, body, title)),
    createPost: (id, body, title, category) => dispatch(createPost(id, body, title, category))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts));
