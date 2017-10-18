import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import { setPost, removeComment, editPostFetch, removePost, editCommentFetch, addCommentFetch } from '../actions';
import Vote from './Vote.js';
const uuid = require ('uuid/v1');
const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Button = require('react-bootstrap').Button;

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      editing: {id: '', state:false},
      editedComment: '',
      editingPost: false,
      editedPostBody: '',
      editedPostTitle: ''
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

  editComment(comment, id, index, remove){
    this.setState({editing:{state:false, id:''}});
    if(this.state.editedComment !== comment){
      this.props.editComment(id, remove, this.state.editedComment, index);
    }
  }

  addComment(comment){
    if(comment.length > 0){
      this.props.addComment(uuid(), comment, this.props.match.params.id);
      this.setState({comment:''});
    }
  }

  render(){
    return (
      <Grid>
        <Row>
          {this.props.app.posts && this.props.app.posts.filter(post => post.id === this.props.match.params.id).map((post, index) => (
          <div key={post.id} className='show-grid'>
            <Col xs={2} sm={1}>
              <Vote postId={post.id} score={post.voteScore} index={index} type='posts' />
            </Col>
            <Col className='flex-center' xs={10} sm={11}>
              {this.state.editingPost ?
                (<input style={{'width':'350px'}} value={this.state.editedPostTitle} onChange={(event)=>this.setState({editedPostTitle:event.target.value})}></input>)
                :
                (<div>{post.title}</div>)
              }
              {this.state.editingPost ?
                (<div className='muted'>{post.voteScore} points by {post.author} <FormattedRelative value={post.timestamp} /> | {this.props.comments[post.id] && this.props.comments[post.id].length} comments | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, false)}>save</a> | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, true)}>delete</a></div>)
                :
                (<div className='muted'>{post.voteScore} points by {post.author} <FormattedRelative value={post.timestamp} /> | {this.props.comments[post.id] && this.props.comments[post.id].length} comments | <a className='clickable' onClick={() => this.setState({editingPost:true, editedPostBody:post.body, editedPostTitle:post.title})}>edit</a> | <a className='clickable' onClick={() => this.editPost(post.body, post.id, index, true)}>delete</a></div>)
              }
              {this.state.editingPost ?
                (<input style={{'width':'350px'}} value={this.state.editedPostBody} onChange={(event)=>this.setState({editedPostBody:event.target.value})}></input>)
                  :
                (<div className="post-body">{post.body}</div>)}
            </Col>
            <Col xs={2} sm={1}>
            </Col>
            <Col xs={10} sm={11}>
              <textarea value={this.state.comment} onChange={(event)=>this.setState({comment:event.target.value})} className='comment-box'></textarea>
              <div><Button onClick={() => this.addComment(this.state.comment)}>add comment</Button></div>
            </Col>
          </div>
          ))}
        </Row>
        {this.props.comments[this.props.match.params.id] && this.props.comments[this.props.match.params.id].map((comment, index) => (
        <Row key={comment.id}>
          <Col xs={2} sm={1}>
            <Vote postId={comment.id} score={comment.voteScore} index={index} type='comments' />
          </Col>
          <Col className='flex-center' xs={10} sm={11}>
            <div className='muted'>{comment.author} <FormattedRelative value={comment.timestamp}/></div>
            {this.state.editing.state && this.state.editing.id === comment.id ? (
              <div>
                <input value={this.state.editedComment} onChange={(event)=>this.setState({editedComment:event.target.value})}></input>
                <div className='muted'><a className='clickable' onClick={() => this.editComment(comment.body, comment.id, index, false)}>save</a> | <a className='clickable' onClick={() => this.editComment(comment.body, comment.id, index, true)}>delete</a></div>
              </div>
            ) :
            (
              <div>
                <div>{comment.body}</div>
                <div className='muted'><a className='clickable' onClick={() => this.setState({editing:{state:true, id:comment.id}, editedComment:comment.body})}>edit</a> | <a className='clickable' onClick={() => this.editComment(comment.body, comment.id, index, true)}>delete</a></div>
              </div>
            )}

          </Col>
        </Row>
      ))}
      </Grid>
    )
  }
}

function mapStateToProps ({app, comments}){
  return {
    app,
    comments
  }
}

function mapDispatchToProps(dispatch){
  return {
    postsSet: (data) => dispatch(setPost(data)),
    commentRemove: (data) => dispatch(removeComment(data)),
    postRemove: (data) => dispatch(removePost(data)),
    editPost: (data) => dispatch(editPostFetch(data)),
    editComment: (id, remove, body, index) => dispatch(editCommentFetch(id, remove, body, index)),
    addComment: (id, comment, parentId) => dispatch(addCommentFetch(id, comment, parentId))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Post));
