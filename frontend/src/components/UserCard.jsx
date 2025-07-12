
// import { Avatar, Card, Typography } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import PropTypes from 'prop-types';

// const UserCard = ({ user = {} }) => {
//     const theme = useTheme();

//     // Provide default values if user properties are missing
//     const {
//         name = 'Unknown User',
//         email = 'No email provided',
//         avatar = '/default-avatar.png',
//         isOnline = false
//     } = user;

//     return (
//         <Card
//             sx={{
//                 p: 2,
//                 mb: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 2,
//                 backgroundColor: theme.palette.grey[100],
//                 '&:hover': {
//                     backgroundColor: theme.palette.grey[200],
//                 }
//             }}
//         >
//             <Avatar
//                 alt={name}
//                 src={avatar}
//                 sx={{ width: 56, height: 56 }}
//             />
//             <div>
//                 <Typography variant="h6">{name}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     {email}
//                 </Typography>
//                 <Typography variant="caption" sx={{
//                     color: isOnline ? 'success.main' : 'text.disabled',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 0.5
//                 }}>
//                     {isOnline ? 'Online' : 'Offline'}
//                 </Typography>
//             </div>
//         </Card>
//     );
// };

// UserCard.propTypes = {
//     user: PropTypes.shape({
//         id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         name: PropTypes.string,
//         email: PropTypes.string,
//         avatar: PropTypes.string,
//         isOnline: PropTypes.bool
//     })
// };

// export default UserCard;


import { Avatar, Card, Typography, Chip, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const UserCard = ({ user = {} }) => {
    const theme = useTheme();

    const {
        name = 'Unknown User',
        email = 'No email provided',
        avatar = '',
        isOnline = false,
        isActive = false,
        createdAt = null
    } = user;

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <Card
            elevation={2}
            sx={{
                p: 2.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover
                }
            }}
        >
            <Avatar
                alt={name}
                src={avatar || '/default-avatar.png'}
                sx={{
                    width: 64,
                    height: 64,
                    border: `2px solid ${isOnline ? theme.palette.success.main : theme.palette.grey[400]}`
                }}
            />

            <Stack spacing={0.5} flexGrow={1}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="small" color="action" /> {name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                    <EmailIcon fontSize="small" color="disabled" />
                    {email}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                    <AccessTimeIcon fontSize="small" color="disabled" />
                    Joined: {formattedDate}
                </Typography>

                <Stack direction="row" spacing={1} mt={0.5}>
                    <Chip
                        label={isOnline ? 'Online' : 'Offline'}
                        size="small"
                        color={isOnline ? 'success' : 'default'}
                        icon={isOnline ? <OnlinePredictionIcon /> : <HighlightOffIcon />}
                    />
                    <Chip
                        label={isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={isActive ? 'primary' : 'warning'}
                        variant={isActive ? 'filled' : 'outlined'}
                    />
                </Stack>
            </Stack>
        </Card>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.string,
        isOnline: PropTypes.bool,
        isActive: PropTypes.bool,
        createdAt: PropTypes.string
    })
};

export default UserCard;
