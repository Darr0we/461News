import {React, useState} from 'react';
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
import { Google as GoogleIcon, Facebook as FacebookIcon, Language as GlobeIcon } from '@mui/icons-material';


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        references: [],
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempted with:', formData);
    };

    
    return (
        <Box 
            sx={{
                minHeight: '100vh',
                bgcolor: 'primary.dark',
                display: 'flex',
                alignItems: 'center',
                py: 4,
            }}
            >
                <Container maxWidth="sm">
                    {/* Logo and Title */}
                    <Box sx={{ mb: 4, color: 'white' }}>
                        <GlobeIcon sx={{ fontSize: 48, color: '#4fd1c5' }} />
                        <Typography variant="h3" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
                            Getting Started With
                            <br />
                            New Feeds Account
                        </Typography>
                    </Box>

                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h4" align="center" gutterBottom>
                            Register
                            </Typography>

                            {/* Social Login Buttons */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    fullWidth
                                    onClick={() => console.log('Google login')}
                                >
                                    Google
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FacebookIcon />}
                                    fullWidth
                                    onClick={() => console.log('Facebook login')}
                                >
                                    Facebook
                                </Button>
                            </Box>

                            {/* Divider */}
                            <Box sx={{ position: 'relative', my: 4 }}>
                                <Divider>
                                    <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                                    OR CONTINUE WITH
                                    </Typography>
                                </Divider>
                            </Box>

                            {/* Login Form */}
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
                                    
                                    <TextField
                                    fullWidth
                                    label="Set Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Topics Preferences"
                                        name="preferences"
                                        type="input"
                                        variant="outlined"
                                        value={formData.references}
                                        onChange={handleInputChange}
                                    />

                                    <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center'
                                    }}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Remember me"
                                    />
                                    <Button 
                                        variant="text" 
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Forgot password?
                                    </Button>
                                    </Box>

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
                                    Log In
                                    </Button>
                                </Box>
                            </form>

                            <Typography 
                            variant="body2" 
                            align="center" 
                            sx={{ mt: 3 }}
                            >
                            Don't have an account?{' '}
                            <Button 
                                variant="text" 
                                sx={{ textTransform: 'none' }}
                            >
                                Create Account
                            </Button>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
        </Box>
    )

}

export default Register;