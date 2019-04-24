// @flow

export default {
    Containers: {
        DefaultStyle: {
            padding: '0 20px 20px 20px',
        },
    },

    NotificationItem: {
        DefaultStyle: { // Applied to every notification, regardless of the notification level
            width: 'auto',
            borderRadius: '4px',
        },
        info: {
            width: 'auto',
            borderTop: 0,
            padding: '16px',
            backgroundColor: 'white',
            color: '#323232',
            WebkitBoxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
            MozBoxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
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
