import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3333',
        video: false,
        retries: {
            openMode: 0,
            runMode: 2,
        },
    },
})
