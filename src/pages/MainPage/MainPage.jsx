// USERS CAN POST THE ARTICLE 
import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Box,
    MenuItem,
    Typography,
    Chip
} from "@mui/material";
import { useTheme } from '@mui/material/styles';


function getStyles(name, hashTag, theme) {
    return {
        fontWeight: hashTag.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
        };
}

const listOfHashTag = [
    'Multi-layered',
    'Function',
    'Fitness',
    'LifeStyle',
    'Stock',
    'Cross-group',
    'Conglomeration',
    'Enterprise-wide',
    'Stable',
    'Impactful',
    'Leverage',
    'Matrix'
];

function MainPage() {
    const theme = useTheme();
    const [hashTag, setHashTag] = React.useState([]);

    const onChangeHashTag = (event) => {
        const {
            target: { value },
        } = event;
        const updatedHashTag = typeof value === 'string' ? value.split(',') : value;
        setHashTag(updatedHashTag); 
        setFormData((prevData) => ({
            ...prevData,
            hashtags: updatedHashTag, 
        }));
    };

    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const [formData, setFormData] = useState({
        title: "",
        hashtags: [],
        publish_date: "",
        content: "",
        rating: 0,
        image_url: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image_url: e.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("HashTag: ", formData.hashtags);
        console.log("Form Data: ", formData);
    }


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData();
    
    //     // Append fields to FormData
    //     Object.keys(formData).forEach((key) => {
    //     data.append(key, formData[key]);
    //     });
    //     try {
    //     const response = await axios.post(
    //         `${API_URL}/products/add-products`,
    //         data,
    //         {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         },
    //         withCredentials: true, // Include cookies for authentication
    //         }
    //     );
    
    //     if (response.status === 201 || response.status === 200) {
    //         alert("Product created successfully!");
    //         console.log("Response:", response.data);
    
    //         // Clear the form after successful submission
    //         setFormData({
    //         title: "",
    //         isbn: "",
    //         author: "",
    //         genre: "",
    //         date_published: "",
    //         price: "",
    //         condition: "",
    //         quantity: 1,
    //         description: "",
    //         image_url: null,
    //         });
    //     } else {
    //         alert("Failed to create product. Please try again.");
    //     }
    //     } catch (error) {
    //     console.error("Error creating product:", error);
    
    //     if (error.response && error.response.data) {
    //         // Display error message from the server
    //         alert(`Error: ${error.response.data.error}`);
    //     } else {
    //         alert("An error occurred. Please try again later.");
    //     }
    //     }
    // };

    return (
        <Container maxWidth="sm">
        <Box
            sx={{
            mt: 17,
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            width: "100%",
            }}
        >
            {/* <PageHeader /> */}
            <Typography variant="h4" gutterBottom>
                Initiate your new Article
            </Typography>
            <form onSubmit={handleSubmit}> 
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Hashtag"
                    name="hashtags"
                    fullWidth
                    margin="normal"
                    select
                    SelectProps={{
                        multiple: true,
                        value: hashTag,
                        onChange: onChangeHashTag,
                        renderValue: (selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                            <Chip key={value} label={value} />
                            ))}
                        </Box>
                        ),
                    }}
                    >
                    {listOfHashTag.map((eachHashTag) => (
                        <MenuItem key={eachHashTag} value={eachHashTag} style={getStyles(eachHashTag, hashTag, theme)}>
                        {eachHashTag}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Date Published"
                    name="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                />
                <TextField
                    label="What's in your mind?"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <TextField
                    label="Upload Image"
                    name="image_url"
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Box>
        </Container>
    );
}

export default MainPage;
