import React from 'react';
import './ArticleCard.css';

function ArticleCard({ post }) {
    return (
        <div className="card">
            {/* {post.image_url && <img src={post.image_url} alt={post.title} />} */}
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p> {/* Shorten content */}
            <a href={`/article/${post.article_id}`} className="btn">
                Read More
            </a>
        </div>
    );
}

export default ArticleCard;
