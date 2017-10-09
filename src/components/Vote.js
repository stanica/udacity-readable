import React, { Component } from 'react';
import { setVote, setVoteComment } from '../actions';
import { connect } from 'react-redux';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      direction: ''
    }
  }
  componentDidMount() {
    this.setState({score:this.props.score});
  }

  vote(direction, id, remove){
    const url = `http://localhost:3001/${this.props.type}/${id}`;
    console.log('fetching from url', url);
    if((direction === 'upVote' && this.state.direction !== 'upVote') || (direction ==='downVote' && this.state.direction !== 'downVote')){
      fetch(url,{
                  method: 'post',
                  headers: { 'Authorization': 'my-auth', 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({option:direction})
                })
        .then( (res) => { return(res.text()) })
        .then((data) => {
          data = JSON.parse(data);
          if(remove){
            direction = '';
          }
          data.index = this.props.index;
          this.setState({score:data.voteScore, direction:direction});
          if(this.props.type === 'posts'){
            this.props.voteSet(data);
          }
          else {
            this.props.voteSetComment(data);
          }
        });
    }
    else {
      if(direction === 'upVote'){
        this.vote('downVote', id, true);
      }
      else if(direction === 'downVote'){
        this.vote('upVote', id, true);
      }
    }
  }

  render(){
    return (
      <div className='midcol'>
        <div onClick={() => this.vote('upVote', this.props.postId)} className={"arrow" + (this.state.direction === 'upVote' ? ' upmod' : ' up')} role="button" aria-label="upvote" tabIndex="0"></div>
        <div className="score unvoted">{this.props.score}</div>
        <div onClick={() => this.vote('downVote', this.props.postId)} className={"arrow" + (this.state.direction === 'downVote' ? ' downmod' : ' down')} role="button" aria-label="downvote" tabIndex="0"></div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    voteSet: (data) => dispatch(setVote(data)),
    voteSetComment: (data) => dispatch(setVoteComment(data))
  }
}

export default connect(
  '',
  mapDispatchToProps
)(Vote);
