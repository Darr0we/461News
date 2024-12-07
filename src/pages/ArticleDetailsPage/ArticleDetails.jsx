import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material'

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/articles/${id}`)
        console.log('Fetching article: ', response);
        if (!response.ok) {
          throw new Error('Failed to fetch Article');
        }
        const data = await response.json();
        console.log('Fetched data: ', data);
        setArticle(data)
      } catch (err) {
        setError(err.message);
      }  finally {
        setLoading(false);
      }
      
    };

    fetchArticleData();
  }, [id])

  const getTitle = () => {
    return article.title
  }

  return (
    <Box>
    {loading ? (
      <Typography variant='h2'>Loading ...</Typography>
    )
    : (
      <Box>
        <Typography  variant='h2'>{article.title}</Typography>
      </Box>
    ) 
    }    
    </Box>
  )
}

export default ArticleDetails;
