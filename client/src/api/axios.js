import axios from 'axios';

export default axios.create({
    baseURL: 'https://book-collection-web-project-api.vercel.app'
});