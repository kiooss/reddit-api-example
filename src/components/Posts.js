import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

const Posts = ({ posts }) => (
  <ul>
    { posts.map((post, i) => <Post post={post} key={i}></Post>) }
  </ul>
)

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Posts
