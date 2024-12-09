import { React, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, TextField, Typography, Paper, Grid2 as Grid, Divider } from '@mui/material';

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const interactionRecorded = useRef(false); // To track if interaction is already recorded

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/articles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Article');
        }
        const data = await response.json();
        console.log('Fetched article data:', data);
        setArticle(data);

        // Record interaction only once
        if (data.topic_id && !interactionRecorded.current) {
          console.log('Recording interaction for topic_id:', data.topic_id);
          await recordInteraction(data.topic_id);
          interactionRecorded.current = true; // Mark as recorded
        }
      } catch (err) {
        console.error('Error fetching article:', err);
      }
    };

    fetchArticleData();
  }, [id]); // Depend only on the article ID

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!article) return;
      try {
        const response = await fetch(`http://localhost:5001/authors/${article.author_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Author');
        }
        const data = await response.json();
        setAuthor(data);
      } catch (err) {
        console.error('Error fetching author:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [article]); // Depend only on the article

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5001/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch Comments');
        }
        const data = await response.json();
        const filteredComments = data.filter(comment => comment.article_id === article.article_id);
        setComments(filteredComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  })

  const recordInteraction = async (topicId) => {
    try {
      const payload = { topic_id: topicId };
      console.log('Sending payload:', payload);

      const response = await fetch('http://localhost:5001/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error response from server:', errorDetails);
        throw new Error(errorDetails.error || 'Failed to record interaction');
      }

      console.log('Interaction recorded successfully');
    } catch (err) {
      console.error('Error recording interaction:', err.message);
    }
  };

  const getPublishDate = () => {
    const words = article.publish_date.split(' ');
    const relevant = words.slice(0, 4);
    return relevant.join(' ');
  };

  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
        height: 'auto',
        width: '100vw',
        paddingTop: '6rem',
      }}
    >
      <Grid container spacing={2}>
        {loading ? (
          <Grid item size={8} offset={2}>
            <Paper elevation={4} sx={{ padding: '1rem' }}>
              <Typography variant="h2">Loading ...</Typography>
            </Paper>
          </Grid>
        ) : (
          <Grid item size={8} offset={2}>
            {/* Article Details */}
            <Paper elevation={4} sx={{ padding: '1rem' }}>
              <Grid item size={10} offset={1}>
                <Paper elevation={6} sx={{ padding: '2rem' }}>
                  <Typography variant="h2">{article.title}</Typography>
                  <Divider
                    variant="middle"
                    sx={{
                      bgcolor: 'primary.main',
                      borderBottomWidth: 'medium',
                      marginBottom: '1rem',
                    }}
                  />
                  <Typography variant="h5">Written by: {author?.name}</Typography>
                  <Grid
                    item
                    size={12}
                    sx={{
                      marginTop: '1.5rem',
                      display: 'flex',
                      justifyContent: 'flexStart',
                    }}
                  >
                    {article.publish_date && (
                      <Typography>Published: {getPublishDate()}</Typography>
                    )}
                    <Divider variant="middle" direction="vertical" />
                    {article.rating != null ? (
                      <Typography>Rating: {article.rating}</Typography>
                    ) : (
                      <Typography>Not yet Rated</Typography>
                    )}
                    <Divider variant="middle" direction="vertical" />
                    {article.hashtags && (
                      <Typography>
                        {article.hashtags
                          .split(',')
                          .map((tag) => tag.padStart(1, '#'))
                          .join(' ')}
                      </Typography>
                    )}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item size={10} offset={1} sx={{ marginTop: '4rem' }}>
                <Typography>{article.content}</Typography>
                <Divider
                  variant="middle"
                  sx={{
                    bgcolor: 'primary.main',
                    borderBottomWidth: 'medium',
                    marginBottom: '5rem',
                  }}
                />
              </Grid>
              {author?.bio && (
                <Grid item size={8} offset={2} sx={{ marginTop: '1.5rem' }}>
                  <Paper elevation={4} sx={{ padding: '1rem' }}>
                    <Typography variant="h4">About the Author: </Typography>
                    <Typography>{author.bio}</Typography>
                  </Paper>
                </Grid>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
      <br />
      {/* Comment Details */}
      <Grid container spacing={2}>
      {loading ? (
          <Grid item size={8} offset={2}>
            <Paper elevation={4} sx={{ padding: '1rem' }}>
              <Typography variant="h2">Loading ...</Typography>
            </Paper>
          </Grid>
        ) : (
          <Grid item size={8} offset={2}>
            <Paper elevation={4} sx={{ padding: '1rem' }}>
              <Grid item size={12} offset={0}>
                <Paper elevation={8} sx={{ padding: '1rem' }}>
                  <Typography variant="h4">{"Comments"}
                    <Divider
                      variant="middle"
                      sx={{
                        bgcolor: 'primary.main',
                        borderBottomWidth: 'medium',
                      }}
                    />
                  </Typography>
                </Paper>
                <br />
                <form style={{display: "flex"}}>
                  <Paper elevation={4} sx={{ padding: '1rem' }}>
                    <TextField 
                      fullWidth
                      label="Write a comment"
                      name='comment_text'
                      type='comment_text'
                      variant='outlined'
                      style={{width: '480px'}}
                    />
                  </Paper>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{
                      ml: "auto",
                      bgcolor: 'primary.dark',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    Submit
                  </Button>
                </form>
                <br />
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Paper elevation={4} sx={{ padding: '1rem' }}
                      key={comment.comment_id}
                    >
                      #{comment.comment_id} {comment.comment_text} <br />
                      {comment.comment_date}
                    </Paper>
                  ))
                ) : (
                  <Paper disabled>Loading comments...</Paper>
                )}
              </Grid>
            </Paper>
          </Grid>
      )}
      </Grid>
    </Box>
  );
}

export default ArticleDetails;
