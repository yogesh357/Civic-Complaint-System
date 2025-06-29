export default (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};