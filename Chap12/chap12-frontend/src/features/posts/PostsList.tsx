// src/features/posts/PostsList.tsx
// "Optimistic updates and real-time feedback": postaus katoaa heti, palautuu jos poisto epäonnistuu.
import { useOptimistic, useState, useTransition } from 'react'
import { Link } from 'react-router'
import { postsApi } from '../../api/endpoints'
import { useAppSelector } from '../../store/hooks'
import type { Post } from '../../types'

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [error, setError] = useState<string | null>(null)
  const user = useAppSelector((state) => state.auth.user)

  const [optimisticPosts, removeOptimistic] = useOptimistic(
    posts,
    (current, deletedId: number) => current.filter((p) => p.id !== deletedId),
  )
  const [, startTransition] = useTransition()

  function handleDelete(id: number) {
    setError(null)
    startTransition(async () => {
      removeOptimistic(id)
      try {
        await postsApi.delete(String(id))
        setPosts((prev) => prev.filter((p) => p.id !== id))
      } catch (e) {
        // Optimistinen tila palautuu automaattisesti, kun transitio päättyy
        setError(e instanceof Error ? e.message : 'Failed to delete post')
      }
    })
  }

  // Sama sääntö kuin backendissä (taulukko 11.2) - vain UX, palvelin päättää
  const canDelete = (post: Post) =>
    user?.id === post.authorId || user?.role === 'ADMIN' || user?.role === 'MODERATOR'

  return (
    <>
      {error && <p className="error">{error}</p>}
      {optimisticPosts.map((post) => (
        <article key={post.id}>
          <Link to={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          {/* content voi backendissä olla null */}
          <p>{(post.content ?? '').slice(0, 150)}...</p>
          {canDelete(post) && (
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          )}
        </article>
      ))}
    </>
  )
}
