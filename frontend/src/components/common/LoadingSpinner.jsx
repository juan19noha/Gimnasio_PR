const LoadingSpinner = ({ size = '40px', color = '#FFD700' }) => {
    const styles = {
        spinner: {
            width: size,
            height: size,
            border: `3px solid ${color}20`,
            borderTop: `3px solid ${color}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;