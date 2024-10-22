import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Link,
    createTheme,
    useMediaQuery,
    ThemeProvider
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';

const TravelSearchForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('');
    const [destination, setDestination] = useState('');
    const [travelType, setTravelType] = useState('');

    const calculateDays = (start, end) => {
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);
        const timeDifference = endDateTime - startDateTime;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 計算旅遊天數
        const day = calculateDays(startDate, endDate);

        const data = {
            season:startDate,
            endDate,
            day,
            budget,
            place: destination,
            purpose: travelType
        };

        fetch('http://127.0.0.1:8080/api/moreopenai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                console.log('Success:', responseData);
                alert('搜尋成功！');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('發生錯誤：' + error.message);
            });
    };

    // 日期變更時的驗證
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);

        if (startDate && newEndDate) {
            const days = calculateDays(startDate, newEndDate);
            if (days < 0) {
                alert('結束日期不能早於開始日期');
                setEndDate('');
            }
        }
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (endDate && newStartDate) {
            const days = calculateDays(newStartDate, endDate);
            if (days < 0) {
                alert('開始日期不能晚於結束日期');
                setStartDate('');
            }
        }
    };

    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 2 }}>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="出發日期"
                                value={startDate}
                                onChange={handleStartDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="回程日期"
                                value={endDate}
                                onChange={handleEndDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="預算 (TWD)"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="請輸入預算金額"
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="目的地"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="請輸入目的地"
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>旅遊類型</InputLabel>
                                <Select
                                    value={travelType}
                                    label="旅遊類型"
                                    onChange={(e) => setTravelType(e.target.value)}
                                >
                                    <MenuItem value="leisure">休閒度假</MenuItem>
                                    <MenuItem value="adventure">冒險探索</MenuItem>
                                    <MenuItem value="culture">文化體驗</MenuItem>
                                    <MenuItem value="food">美食之旅</MenuItem>
                                    <MenuItem value="shopping">購物行程</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    bgcolor: 'black',
                                    '&:hover': {
                                        bgcolor: 'grey.800',
                                    },
                                }}
                            >
                                搜尋
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

const TopBar = () => (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
                不知道要取什麼
            </Typography>
            <Button
                color="inherit"
                component={RouterLink}
                to="/"
                sx={{
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(165,165,165,0.1)',
                    }
                }}
            >
                首頁
            </Button>
            <Button color="inherit" component={RouterLink} to="/about">關於我</Button>
            <Button color="inherit" component={RouterLink} to="/portfolio">我的作品集</Button>
        </Toolbar>
    </AppBar>
);

const NotFound = () => (
    <Typography variant="h4">404 - 找不到頁面</Typography>
);
const Success = () => (
    <Typography variant="h4">200 成功測試頁面</Typography>
);

const Home = () => (
    <div>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
            開始規劃你的旅程
        </Typography>
        <TravelSearchForm />
    </div>
);

const About = () => <Typography>關於我</Typography>;

const Portfolio = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects([
            { id: 1, name: '項目一' },
            { id: 2, name: '項目二' },
        ]);
    }, []);

    return (
        <div>
            <Typography variant="h4">我的作品集</Typography>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: 'Arial',
        h4: {
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
    },
});

const App = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Grid container direction="column" style={{ minHeight: '100vh' }}>
                    <Grid item>
                        <TopBar />
                    </Grid>
                    <Grid item xs>
                        <Grid container style={{ padding: isMobile ? '10px' : '20px' }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/portfolio" element={<Portfolio />} />
                                <Route path="*" element={<NotFound />} />
                                <Route path="/success" element={<Success />} />
                            </Routes>
                        </Grid>
                    </Grid>
                </Grid>
            </Router>
        </ThemeProvider>
    );
};

export default App;
