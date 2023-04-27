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
            overflow: 'hidden', // prevent notification content from falling outside notification
            boxShadow: '0 8px 12px 0 #52525226, 0 0 1px 0 #00000040',
            borderRadius: '8px',
            height: 'auto'
        },
        info: {
            width: 'auto',
            borderTop: 0,
            padding: '20px 16px',
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
