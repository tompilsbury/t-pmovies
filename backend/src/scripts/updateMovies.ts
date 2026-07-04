// To-do. Loop through TMDB's /discover/movie endpoint to update movie lists in db.
import 'dotenv/config';
import { tmdbMovie } from '../types/movie';

const BASE_URL = `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=false&include_video=false&sort_by=release_date.desc`;
const OPTIONS = {
  method: 'GET',
  headers: {accept: 'application/json', Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
};


function startFetchLoop() {
    const page = 1;
    const url = `${BASE_URL}&page=${page}`;

    fetch(url, OPTIONS)
        .then(res => res.json())
        .then(json => {
            const movies = json.results;
        })
        .catch(err => console.error(err));
}

function parseJsonToTmdbMovie(json: any): tmdbMovie {
    return {
        id: json.id,
        title: json.title,
        language: json.original_language,
        overview: json.overview,
        poster_path: json.poster_path,
        rating: json.vote_average,
        rating_count: json.vote_count,
        release_date: new Date(json.release_date)
    }
}

startFetchLoop();