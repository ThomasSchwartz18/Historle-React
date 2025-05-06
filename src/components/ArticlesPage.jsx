import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'

/**
 * ArticlesPage loads historical write-ups from a Supabase 'posts' table
 * Fallback: display static message if none
 */
export default function ArticlesPage() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setPosts(data)
    }
    loadPosts()
  }, [])

  return (
    <main className="articles-page">
      <h1>Articles</h1>
      {error && <p>Error loading articles: {error}</p>}
      {posts.length === 0 ? (
        <p>No articles available. Check back soon!</p>
      ) : (
        posts.map(post => (
          <article key={post.id} className="post">
            <h2>{post.title}</h2>
            <p className="subheading">{new Date(post.created_at).toLocaleDateString()}</p>
            <div className="full-article" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        ))
      )}
    </main>
  )
}
