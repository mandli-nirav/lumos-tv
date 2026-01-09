import axios from 'axios';

const livesport = axios.create({
  baseURL: 'https://livesport.su/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default livesport;
