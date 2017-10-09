import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import { setPost, editComment, removeComment, editPost, removePost } from '../actions';
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

  componentDidMount(){
    if(!this.props.app.posts.length){
      const url = `http://localhost:3001/posts/${this.props.match.params.id}`;
      console.log('fetching from url', url);
      fetch(url, { headers: { 'Authorization': 'my-auth'},
                   credentials: 'same-origin'} )
        .then( (res) => { return(res.text()) })
        .then((data) => {
          data = JSON.parse(data);
          if(data.id){
            let commentsUrl = `http://localhost:3001/posts/${data.id}/comments`;
            console.log('fetching from url', commentsUrl);
            fetch(commentsUrl, { headers: { 'Authorization': 'my-auth'},
                         credentials: 'same-origin'} )
              .then( (res) => { return(res.text()) })
              .then((comments) => {
                //data.comments = JSON.parse(comments);
                //data.comments.sort((x,y) => y.voteScore - x.voteScore);

                var obj = {
                  key: data.id,
                  comments: JSON.parse(comments).sort((x,y) => y.voteScore - x.voteScore)
                }
                this.props.postsSet(data);
                this.props.commentsSet(obj);
              });
            }
            else {
              this.props.history.push('/');
            }
        });
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
    const url = `http://localhost:3001/posts/${id}`;
    console.log('fetching from url', url);
    var body = {
      timestamp: Date.now(),
      body: this.state.editedPostBody,
      title: this.state.editedPostTitle
    }
    fetch(url,{
                method: remove ? 'delete' : 'put',
                headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(body)
              })
      .then( (res) => { return(res.text()) })
      .then((data) => {
        data = JSON.parse(data);
        data.index = index;
        if(!remove){
          this.props.postEdit(data);
        }
        else {
          this.props.postRemove(data);
          this.props.history.push('/');
        }
      });
  }

  editComment(comment, id, index, remove){
    this.setState({editing:{state:false, id:''}});
    if(this.state.editedComment !== comment){
      const url = `http://localhost:3001/comments/${id}`;
      console.log('fetching from url', url);
      var body = {
        timestamp: Date.now(),
        body: this.state.editedComment
      }
      fetch(url,{
                  method: remove ? 'delete' : 'put',
                  headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify(body)
                })
        .then( (res) => { return(res.text()) })
        .then((data) => {
          data = JSON.parse(data);
          data.index = index;
          if(!remove){
            this.props.commentEdit(data);
          }
          else {
            this.props.commentRemove(data);
          }
        });
    }
  }

  addComment(comment){
    if(comment.length > 0){
      const url = `http://localhost:3001/comments`;
      console.log('fetching from url', url);
      var body = {
        id: uuid(),
        timestamp: Date.now(),
        body: this.state.comment,
        author: 'user' + Math.floor(Math.random() * 2000) + 1,
        parentId: this.props.match.params.id
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
          this.props.comments[data.parentId].push(data);
          var obj = {
            key: data.parentId,
            comments: this.props.comments[data.parentId].sort((x,y) => y.voteScore - x.voteScore)
          }
          this.props.commentsSet(obj);
          this.setState({comment:''});
        });
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
          </div>
          ))}
          <Col xs={2} sm={1}>
          </Col>
          <Col xs={10} sm={11}>
            <div><textarea value={this.state.comment} onChange={(event)=>this.setState({comment:event.target.value})} className='comment-box'></textarea></div>
            <Button onClick={() => this.addComment(this.state.comment)}>add comment</Button>
          </Col>
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

function mapStateToProps ({post, app, comments}){
  return {
    app,
    comments
  }
}

function mapDispatchToProps(dispatch){
  return {
    postsSet: (data) => dispatch(setPost(data)),
    commentEdit: (data) => dispatch(editComment(data)),
    commentRemove: (data) => dispatch(removeComment(data)),
    postRemove: (data) => dispatch(removePost(data)),
    postEdit: (data) => dispatch(editPost(data))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Post));
