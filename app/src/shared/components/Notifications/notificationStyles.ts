export default {
    Containers: {
        DefaultStyle: {
            padding: '0 20px 20px 20px',
        },
    },
    NotificationItem: {
        DefaultStyle: {
            // Applied to every notification, regardless of the notification level
            width: 'auto',
            borderRadius: '4px',
            overflow: 'hidden', // prevent notification content from falling outside notification
        },
        info: {
            width: 'auto',
            borderTop: 0,
            padding: '16px',
            backgroundColor: 'white',
            color: '#323232',
            WebkitBoxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
            MozBoxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        },
    },
    Title: {
        DefaultStyle: {
            display: 'none',
        },
    },
    MessageWrapper: {
        DefaultStyle: {
            display: 'none',
        },
    },
    Dismiss: {
        DefaultStyle: {
            display: 'none',
        },
    },
}
