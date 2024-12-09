import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ArticleCard from '../../components/card/ArticleCard';

function HomePage() {
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [topic, setTopic] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const perPage = 20;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const topicId = queryParams.get('topic') || 'all';

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
    
            try {
                const userId = localStorage.getItem('user_id');
                const url = topicId !== 'all'
                    ? `http://localhost:5001/articles?topic_id=${topicId}&page=${page}&per_page=${perPage}`
                    : userId
                        ? `http://localhost:5001/articles?user_id=${userId}&page=${page}&per_page=${perPage}`
                        : `http://localhost:5001/articles?page=${page}&per_page=${perPage}`;
                
                console.log("Fetching URL:", url);
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error fetching posts:', errorData);
                    throw new Error(`Failed to fetch posts: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("Fetched Posts:", data);
                setPosts(data);
            } catch (err) {
                console.error('Fetch posts error:', err.message);
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

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await fetch(`http://localhost:5001/users/${parseInt(userId)}/preferences`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch preferences');
                  }
                const data = await response.json();
                setRecommendations(data.recommendations);
                setPreferences(data.preferences);
            } catch (err) {
                console.error('Error fetching preferences:', err);
            }
        };

        if (isLoggedIn){
            fetchPreferences();
        }
    }, [isLoggedIn]);

    const recommendedPosts = posts.filter(post =>
        recommendations.some(recommendation => recommendation.topic_id === post.topic_id)
    );

    const filteredPosts = posts.filter(post =>
        preferences.some(preference => preference.topic_id === post.topic_id)
    );

    return (
        <div style={{ backgroundColor: '#2196f3' }} className="homepage">
            <h1 style={{ backgroundColor: 'white' }}>
                {topicId !== 'all' ? 
                    `Posts for ${topic?.name}` : 
                    isLoggedIn ? 
                        <p>&nbsp;&nbsp;&nbsp;
                            Recommended Posts 
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Your Preferred Posts</p> : 
                        'Latest Posts'}
            </h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : isLoggedIn && filteredPosts.length > 0 ? (
                <div class="row">
                    <div class="col s12">
                        {recommendedPosts.length > 0 ? (
                            recommendedPosts.map((post) => (
                                <ArticleCard key={post.article_id} post={post} />
                            ))
                        ) : (
                            <p>No posts available based on your preferences.</p>
                        )} 
                    </div>
                    <div class="col s12"> 
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <ArticleCard key={post.article_id} post={post} />
                            ))
                        ) : (
                            <p>No posts available based on your preferences.</p>
                        )} 
                    </div>
                </div>
            ) : (
                <div className="articles">
                    {posts.length > 0 ? (
                        posts
                        .filter((post, index, self) => index === self.findIndex(p => p.article_id === post.article_id)) // Remove duplicates
                        .map((post) => (
                        <ArticleCard key={`${post.article_id}-${post.topic_id}`} post={post} />
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
