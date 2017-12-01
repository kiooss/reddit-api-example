import fetch from 'cross-fetch'

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const FETCH_POSTS_ERROR = 'FETCH_POSTS_ERROR'
export const RESET_ERROR = 'RESET_ERROR'

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export function fetchPostsError(subreddit, err) {
  return {
    type: FETCH_POSTS_ERROR,
    subreddit,
    err
  }
}

export function resetError() {
  return {
    type: RESET_ERROR
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (getState().errors.length > 0) {
      dispatch(resetError())
    }
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    }
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]

  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => {
        if (!response.ok) {
          throw Error(`Subreddit: ${subreddit} doesn't exist.`)
        }
        return response
      })
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
      .catch(err => dispatch(fetchPostsError(subreddit, err.message)))
  }
}
