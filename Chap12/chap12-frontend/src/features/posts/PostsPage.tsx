// src/features/posts/PostsPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { postsApi } from '../../api/endpoints'
import type { Post } from '../../types'
import { PostsList } from './PostsList'

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    postsApi
      .getAll()
      .then((res) => setPosts(res.data))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p>Loading posts...</p>
  }

  return (
    <div>
      <h1>Posts</h1>
      <Link to="/posts/new">Create Post</Link>
      {/* "Optimistic post deletion" -osion lista, jossa on Delete-napit */}
      <PostsList initialPosts={posts} />
    </div>
  )
}
