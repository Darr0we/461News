import { React, useEffect, useState } from 'react';
import './ArticleCard.css';

function ArticleCard({ post }) {
    const [topic, setTopic] = useState(null);
    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/topics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Topic');
                  }
                  const data = await response.json();
                  const matchedTopic = data.find(topic => topic.topic_id === post.topic_id);
                  setTopic(matchedTopic);
            } catch (err) {
                console.error('Error fetching topic:', err);
            }
        };

        if (post.topic_id){
            fetchTopicData();
        }
    }, [post.topic_id]);

    return (
        <div className="card">
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p> 
            <p><strong>Topic:</strong> {topic?.name}</p>
            <a href={`/article/${post.article_id}`} className="btn">
                Read More
            </a>
        </div>
    );
}

export default ArticleCard;
