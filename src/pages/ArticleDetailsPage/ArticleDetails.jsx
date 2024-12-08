import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid2 as Grid, Divider} from '@mui/material'

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
    };

    fetchArticleData()
  }, [id])

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (article == null) {
        return;
      }
      try {
        const response = await fetch(`http://localhost:5001/authors/${article.author_id}`)
        // console.log('Fetching author: ', response);
        if (!response.ok) {
          throw new Error('Failed to fetch Author');
        }
        const data = await response.json();
        // console.log('Fetched data: ', data);
        setAuthor(data)
      } catch (err) {
      }  finally {
        setLoading(false);
      }
    }
    
    fetchAuthorData();
  }, [article])

  const getPublishDate = () => {
    const words = article.publish_date.split(' ');
    const relevant = words.slice(0, 4)
    console.log("words: ", words)
    console.log("relevant: ", relevant)
    return relevant.join(' ')
  }

  return (
    <Box sx={{ 
      bgcolor:"primary.dark", 
      height: "100vh", 
      width: "100vw", 
      paddingTop: "6rem"
    }}>
      <Grid container spacing={2}>
      {loading ? (
        <Grid Item size={8} offset={2}>
          <Paper elevation='4' sx={{padding: '1rem'}}>
            <Typography variant='h2'>Loading ...</Typography>
          </Paper>
        </Grid>
      )
      : (
        <Grid Item size={8} offset={2}> {/* article title and author info */}
          <Paper elevation='4' sx={{padding: '1rem'}}>
            <Grid item size={10} offset={1}>
              <Paper elevation='6' sx={{padding: '2rem'}}>
                <Typography variant='h2'>{article.title}</Typography>
                <Divider variant='middle' sx={{
                  bgcolor: 'primary.main', 
                  borderBottomWidth: 'medium',
                  marginBottom: '1rem'
                }}/>
                <Typography variant='h5'>Written by: {author.name}</Typography>
                <Grid item size={12} sx={{marginTop: '1.5rem', 
                    display:'flex',
                    justifyContent: 'flexStart'}}> {/* article metadata */}
                  { (article.publish_date != null) && <Typography>Published: {getPublishDate()}</Typography> }
                  <Divider variant='middle' direction='vertical'/>
                  { article.rating != null ?
                    <Typography>Rating: {getPublishDate()}</Typography> :
                    <Typography>Not yet Rated</Typography>
                  }
                  <Divider variant='middle' direction='vertical'/>
                  { article.hashtags != null &&
                    <Typography>{article.hashtags.split(',').map((tag) => tag.padStart(1, '#')).join(' ')}</Typography>}
                </Grid>
              </Paper>
            </Grid>
            <Grid item size={10} offset={1} sx={{marginTop: '4rem'}}> {/* article content */}  
                <Typography>{article.content}</Typography>
                <Divider variant='middle' sx={{
                  bgcolor: 'primary.main', 
                  borderBottomWidth: 'medium',
                  marginBottom: '5rem'
                }}/>
            </Grid>
            {author.bio != null && <Grid item size={8} offset={2} sx={{marginTop: '1.5rem'}}> {/* author bio  */}
              <Paper elevation='4' sx={{
                padding: '1rem', 
              }}>
                <Typography variant='h4'>About the Author: </Typography>
                <Typography>{author.bio}</Typography>
              </Paper>
            </Grid>}
          </Paper>
        </Grid>
      ) 
      }    
      </Grid>
    </Box>
  )
}

export default ArticleDetails;
