import axios from 'axios';

export default axios.create({
    // baseURL: 'https://localhost:3500'
    baseURL: 'https://book-collection-web-project-api.vercel.app'
});
