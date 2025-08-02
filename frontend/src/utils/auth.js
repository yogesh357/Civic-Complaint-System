 

export const checkAuth = (user) => {
    if (!user) {
        throw {
            type: 'UNAUTHENTICATED',
            message: 'Please login to access this page',
            showModal: true
        };
    }
    return true;
};

export const checkRoles = (user, allowedRoles = []) => {
    // Allow access if no specific roles required
    if (!allowedRoles || allowedRoles.length === 0) return true;

    // Check if user has any of the allowed roles
    if (!user?.roles?.some(role => allowedRoles.includes(role))) {
        throw {
            type: 'UNAUTHORIZED',
            message: 'You do not have permission to access this page',
            showModal: false
        };
    }
    return true;
};

export const verifyAccess = (user, allowedRoles) => {
    try {
        checkAuth(user);
        checkRoles(user, allowedRoles);
        return { granted: true };
    } catch (error) {
        return {
            granted: false,
            error: {
                ...error,
                showModal: error.showModal !== undefined ? error.showModal : false
            }
        };
    }
};