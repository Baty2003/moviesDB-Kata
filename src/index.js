import React from 'react';
import ReactDOM from 'react-dom/client';

import MovieApi from './MovieDBApi/MovieDBAPI';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

const movieApi = new MovieApi();
