import React, { useState } from "react";
import {
    Button,
    TextField,
    Card,
    CardContent,
    Typography,
    Divider,
    Box,
    Container,
    Chip,
    MenuItem
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, Language as GlobeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


const listOfPreferences = [
    'Technology',
    'Finance',
    'Politics',
    'LifeStyle',
    'Stock',
    'Fitness',
    'Travel',
    'Medicare',
    'Cooking',
];

function getStyles(name, preferences, theme) {
    return {
        fontWeight: preferences.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
        };
}


const Register = () => {
    const theme = useTheme();
    const [preferences, setPreferences] = React.useState([]);

    const onChangePreferences = (event) => {
        const {
            target: { value },
        } = event;
        const updatedPreferences = typeof value === 'string' ? value.split(',') : value;
        setPreferences(updatedPreferences); 
        setFormData((prevData) => ({
            ...prevData,
            references: updatedPreferences, 
        }));
    };


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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Failed to register user');
            }
    
            const data = await response.json();
            console.log('Registration successful:', data);
            alert('Registration successful! You can now log in.');
        } catch (err) {
            console.error('Error during registration:', err.message);
            alert(`Registration failed: ${err.message}`);
        }
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
                                        label="Preferences"
                                        name="preferences"
                                        fullWidth
                                        margin="normal"
                                        select
                                        SelectProps={{
                                            multiple: true,
                                            value: preferences,
                                            onChange: onChangePreferences,
                                            renderValue: (selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                            ),
                                        }}
                                        >
                                        {listOfPreferences.map((eachPreference) => (
                                            <MenuItem key={eachPreference} value={eachPreference} style={getStyles(eachPreference, preferences, theme)}>
                                            {eachPreference}
                                            </MenuItem>
                                        ))}
                                    </TextField>

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
                                    Register
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
        </Box>
    )

}

export default Register;