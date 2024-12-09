import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Card,
    CardContent,
    Typography,
    Divider,
    Checkbox,
    FormControlLabel,
    Box,
    Container,
} from '@mui/material';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({username: '', email: '',});

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/users/${user.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Failed to update user profile');
            }
    
            const data = await response.json();
            console.log('Profile update successful:', data);
            alert('Update successful!');
        } catch (err) {
            console.error('Error during Profile update:', err.message);
            alert(`Profile update failed: ${err.message}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 400, p: 4 }}>
              <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Update Profile
                    </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            variant="outlined"
                            value={formData.username}
                            onChange={handleInputChange}
                            />
                                    
                            <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleInputChange}
                            />

                            <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ 
                                mt: 2,
                                bgcolor: 'primary.dark',
                                '&:hover': {
                                bgcolor: 'primary.main',
                                }
                                }}
                            >
                            Update
                            </Button>

                            <Button
                            onClick={() => navigate('/profile')}
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ 
                                mt: 2,
                                bgcolor: 'primary.dark',
                                '&:hover': {
                                bgcolor: 'primary.main',
                                }
                                }}
                            >
                            Return to profile
                            </Button>
                        </Box>
                    </form>
              </CardContent>
          </Card>
        </Box>
      );
}

export default EditProfile;
