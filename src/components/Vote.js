import React, { Component } from 'react';
import { setVote, setVoteComment, vote } from '../actions';
import { connect } from 'react-redux';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: ''
    }
  }

  vote(direction, id, type, stateDirection, index){
    if((direction === 'upVote' && stateDirection !== 'upVote') || (direction ==='downVote' && stateDirection !== 'downVote')){
      this.props.vote(direction, id, type, index);
      if(this.state.direction !== ''){
        this.props.vote(direction, id, type, index);
      }
      this.setState({direction});
    }
    else {
      this.setState({direction:''});
      if(direction === 'upVote'){
        direction = 'downVote';
      }
      else {
        direction = 'upVote';
      }
      this.props.vote(direction, id, type, index);
    }
  }

  render(){
    return (
      <div className='midcol'>
        <div onClick={() => this.vote('upVote', this.props.postId, this.props.type, this.state.direction, this.props.index)} className={"arrow" + (this.state.direction === 'upVote' ? ' upmod' : ' up')} role="button" aria-label="upvote" tabIndex="0"></div>
        <div className="score unvoted">{this.props.score}</div>
        <div onClick={() => this.vote('downVote', this.props.postId, this.props.type, this.state.direction, this.props.index)} className={"arrow" + (this.state.direction === 'downVote' ? ' downmod' : ' down')} role="button" aria-label="downvote" tabIndex="0"></div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    voteSet: (data) => dispatch(setVote(data)),
    voteSetComment: (data) => dispatch(setVoteComment(data)),
    vote: (direction, id, type, index) => dispatch(vote(direction, id, type, index))
  }
}

export default connect(
  '',
  mapDispatchToProps
)(Vote);
