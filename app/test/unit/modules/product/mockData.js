export const existingProduct = {
    id: '459828a2f9df2991e5a3d921dda23b4c09a84cd6bc7930dcf1ad829d5ee006ed',
    name: 'Weather on North Atlantic',
    description: 'Weather on North Atlantic. Weather on North Atlantic. Weather on North Atlantic. ',
    category: 'personal-id',
    streams: [
        'c1_fiG6PTxmtnCYGU-mKuQ',
        'ln2g8OKHSdi7BcL-bcnh2g',
    ],
    pricePerSecond: '0.00001898',
    ownerAddress: '0x942e694ec12d009f45aead2563426adc182ff527',
    beneficiaryAddress: '0x72cf0d1ac81571a6cf767fd649ec95f5e12da541',
    previewConfigJson: '',
    previewStream: 'ln2g8OKHSdi7BcL-bcnh2g',
    state: 'DEPLOYED',
    isFree: false,
    priceCurrency: 'USD',
    minimumSubscriptionInSeconds: 560,
    owner: 'Tester One',
    imageUrl: 'https://images.pexels.com/photos/744515/pexels-photo-744515.jpeg?h=400',
    thumbnailUrl: 'https://images.pexels.com/photos/744515/pexels-photo-744515.jpeg?h=210',
}

export const existingStreams = [
    {
        id: 'c1_fiG6PTxmtnCYGU-mKuQ',
        partitions: 1,
        name: 'CanvasSpec',
        feed: {
            id: 7,
            name: 'API',
            module: 147,
        },
        config: {
            topic: 'c1_fiG6PTxmtnCYGU-mKuQ',
            fields: [
                {
                    name: 'temperature',
                    type: 'number',
                },
                {
                    name: 'rpm',
                    type: 'number',
                },
                {
                    name: 'text',
                    type: 'string',
                },
            ],
        },
        description: 'Used by CanvasSpec to test running canvases',
        uiChannel: false,
        dateCreated: '2017-05-03T10:25:17Z',
        lastUpdated: '2017-05-03T10:25:17Z',
    },
    {
        id: 'ln2g8OKHSdi7BcL-bcnh2g',
        partitions: 1,
        name: 'Twitter-Bitcoin',
        feed: {
            id: 7,
            name: 'API',
            module: 147,
        },
        config: {
            fields: [
                {
                    name: 'text',
                    type: 'string',
                },
                {
                    name: 'user',
                    type: 'object',
                },
                {
                    name: 'retweet_count',
                    type: 'number',
                },
                {
                    name: 'favorite_count',
                    type: 'number',
                },
                {
                    name: 'lang',
                    type: 'string',
                },
            ],
        },
        description: 'Bitcoin mentions on Twitter',
        uiChannel: false,
        dateCreated: '2016-05-31T18:16:00Z',
        lastUpdated: '2016-05-31T18:16:00Z',
    },
]

export const existingCategory = {
    id: 'personal-id',
    name: 'Personal',
    imageUrl: null,
}

export const existingCategories = [existingCategory]
