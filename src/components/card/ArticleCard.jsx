import React from 'react';
import './ArticleCard.css';

function ArticleCard({ post }) {
    const getID = () => {
        return post.article_id
    }

    return (
        <div className="card">
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p> 
            <p><strong>Topic ID:</strong> {getID()}</p>
            <a href={`/article/${post.article_id}`} className="btn">
                Read More
            </a>
        </div>
    );
}

export default ArticleCard;
