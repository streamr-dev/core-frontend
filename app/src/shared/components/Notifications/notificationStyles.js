// @flow

export default {
    NotificationItem: {
        DefaultStyle: { // Applied to every notification, regardless of the notification level
            width: 'auto',
        },
        info: {
            width: 'auto',
            borderTop: 0,
            padding: '16px',
            backgroundColor: 'white',
            color: 'black',
            WebkitBoxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            MozBoxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
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
