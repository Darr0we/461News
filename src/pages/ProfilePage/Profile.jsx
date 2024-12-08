import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Avatar } from '@mui/material';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
              navigate('/login'); 
          }
      };

      fetchUserData();
  }, [navigate]);

  if (!user) {
      return <Typography>Loading...</Typography>;
  }

  return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 400, p: 4 }}>
              <CardContent>
                  <Avatar
                      src={'https://via.placeholder.com/150'}
                      alt={user.username}
                      sx={{ width: 100, height: 100, mb: 3, mx: 'auto' }}
                  />
                  <Typography variant="h5" align="center" gutterBottom>
                      {user.username}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                      <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                      <strong>Account Created:</strong> {new Date(user.created_at).toLocaleString()}
                  </Typography>
                  <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={() => navigate('/edit-profile')}
                  >
                      Edit Profile
                  </Button>
              </CardContent>
          </Card>
      </Box>
  );
}

export default Profile;
