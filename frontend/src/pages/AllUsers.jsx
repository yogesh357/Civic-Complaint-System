
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, CircularProgress } from '@mui/material';
import UserCard from '../components/UserCard';
import { useAuthContext } from '../context/AuthContext';

const AllUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user, userType, allUsers } = useAuthContext();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(!allUsers || allUsers.length === 0);
    console.log("getting user")
    console.log("Current allUsers:", allUsers);

    useEffect(() => {

        // If we already have users data, we're not loading
        if (allUsers && allUsers.length > 0) {
            setLoading(false);
        }
    }, [allUsers]);

    useEffect(() => {
        if (allUsers && allUsers.length > 0) {
            const filtered = allUsers.filter(u =>
                (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [searchTerm, allUsers]);


    if (!user || userType !== 'ADMIN') {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">
                    You don't have permission to view this page
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>

            <TextField
                label="Search users"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {filteredUsers.length} users found
                    </Typography>

                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <UserCard key={user.id} user={user} />
                        ))
                    ) : (
                        <Typography>No users found</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default AllUsers;