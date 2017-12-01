import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import {
  fetchPostsIfNeeded,
  selectSubreddit,
  invalidateSubreddit
} from '../actions'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  handleChange(nextSubreddit) {
    const { dispatch } = this.props
    dispatch(selectSubreddit(nextSubreddit))
    dispatch(fetchPostsIfNeeded(nextSubreddit))
  }

  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  renderErrorMessage() {
    const { errors } = this.props
    if (errors.length === 0) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        {errors.map((err, i) => <b key={i}>{err}</b>)}
      </p>
    )
  }

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props

    const options = [
      'reactjs',
      'frontend',
      'javascript',
      'programming',
      'design',
      'php'
    ]

    return (
      <div>
        <Picker value={selectedSubreddit} onChange={this.handleChange} options={options} />
        {lastUpdated && <span>Last updated At: {new Date(lastUpdated).toLocaleTimeString()}</span>}
        {'  '}
        {!isFetching && <button onClick={this.handleRefreshClick}>Refresh</button>}

        {this.renderErrorMessage()}

        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}

        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    )
  }
}

App.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  errors: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit, errors } = state

  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    errors,
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default withRouter(connect(mapStateToProps)(App))
