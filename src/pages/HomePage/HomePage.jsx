import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ArticleCard from '../../components/card/ArticleCard';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [topic, setTopic] = useState(null);
    const [user, setUser] = useState(null);
    const perPage = 20;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const topicId = queryParams.get('topic') || 'all';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5001/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
  
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
  
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
  
        if (localStorage.getItem('token')) {
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:5001/articles?topic_id=${topicId}&page=${page}&per_page=${perPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [topicId, page]);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/topics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Topic');
                  }
                  const data = await response.json();
                  const matchedTopic = data.find(topic => topic.topic_id === parseInt(topicId));
                  setTopic(matchedTopic);
            } catch (err) {
                console.error('Error fetching topic:', err);
            }
        };

        if (topicId){
            fetchTopicData();
        }
    }, [topicId]);

    return (
        <div style={{ backgroundColor: '#2196f3' }} className="homepage">
            <h1 style={{ backgroundColor: 'white' }}>
                {topicId === 'all' ? 'Latest Posts' : `Posts for ${topic?.name}`}
            </h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="articles">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <ArticleCard key={post.article_id} post={post} />
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
                {posts.length === perPage && <button onClick={() => setPage(page + 1)}>Next</button>}
            </div>
        </div>
    );
}

export default HomePage;
