import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  FETCH_POSTS_ERROR,
  RESET_ERROR
} from '../actions'
import { combineReducers } from 'redux'

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  }, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return {...state, didInvalidate: true}
    case REQUEST_POSTS:
      return {...state, isFetching: true, didInvalidate: false}
    case RECEIVE_POSTS:
      return {...state, isFetching: false, didInvalidate: false, items: action.posts, lastUpdated: action.receivedAt}
    case FETCH_POSTS_ERROR:
      return {...state, isFetching: false, didInvalidate: false}
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
    case FETCH_POSTS_ERROR:
      return {...state, [action.subreddit] : posts(state[action.subreddit], action)}
    default:
      return state
  }
}

function errors(state = [], action) {
  switch (action.type) {
    case FETCH_POSTS_ERROR:
      return state.concat([action.err])
    case RESET_ERROR:
      return []
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedSubreddit,
  postsBySubreddit,
  errors
})

export default rootReducer
