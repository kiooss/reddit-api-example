import React from 'react'
import PropTypes from 'prop-types'

const Post = ({ post }) => (
  <li>
    {post.thumbnail && <img src={post.thumbnail} alt=""/>}
    <h3>{post.domain}</h3>
    <p><a href={post.url} target="_blank">{post.title}</a></p>
  </li>
)

Post.propTypes = {
  post: PropTypes.shape({
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })
}

export default Post
