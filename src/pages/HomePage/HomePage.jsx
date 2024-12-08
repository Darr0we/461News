import React, { useEffect, useState } from 'react';
import ArticleCard from '../../components/card/ArticleCard';

function HomePage({ category }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:5001/articles?category=${category}`);
                console.log('Fetching articles:', response);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log('Fetched data:', data);
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category]);

    return (
        <div style={{backgroundColor: '#2196f3'}} className="homepage">
            <h1 style={{backgroundColor: 'white'}}>{category === 'all' ? 'Latest Posts' : `${category.toUpperCase()} Posts`}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="articles">
                    {posts.length > 0 ? (
                        posts.map((post) => <ArticleCard key={post.article_id} post={post} />)
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;
