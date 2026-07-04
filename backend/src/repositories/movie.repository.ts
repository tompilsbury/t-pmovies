import { ResultSetHeader } from "mysql2";

import connection from "../db/index";
import Movie from "../models/movie.model";

interface IMovieRepository {
    save(movie: Movie): Promise<Movie>;
    retrieveAll(searchParams: {title?: string, watched?: boolean}): Promise<Movie[]>;
    retrieveById(movieId: number): Promise<Movie | undefined>;
    update(movie: Movie): Promise<number>;
    delete(movieId: number): Promise<number>;
}

class MovieRepository implements IMovieRepository { 
    save(movie: Movie): Promise<Movie> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                "INSERT INTO movies (title, language, overview, poster_path, rating, rating_count, release_date, watched) VALUES (?,?,?,?,?,?,?,?,?)",
                [movie.title, movie.language, movie.overview, movie.poster_path, movie.rating, movie.rating_count, movie.release_date, movie.watched ? movie.watched : false],
                (err, res) => {
                    if (err) reject(err);
                    else
                        this.retrieveById(res.insertId)
                            .then((movie) => resolve(movie!))
                            .catch(reject);
                }
            );
        });
    }

    retrieveAll(searchParams: {title?: string, watched?: boolean}): Promise<Movie[]> {
        let query: string = "SELECT * from movies";
        let condition: string = "";

        if (searchParams.watched) {
            condition += "watched = TRUE";
        }

        if (searchParams.title) {
            condition += `LOWER(title) LIKE '%${searchParams.title}%'`;
        }

        if (condition.length) {
            query += " WHERE " + condition;
        }

        return new Promise((resolve, reject) => {
            connection.query<Movie[]>(query, (err, res) => {
                if (err) reject(err)
                else resolve(res);
            });
        });
    }

    retrieveById(movieId: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            connection.query<Movie[]>(
            "SELECT * FROM movies WHERE id = ?",
            [movieId],
            (err, res) => {
                if (err) reject(err);
                else resolve(res?.[0]);
            }
            );
        });
    }

    update(movie: Movie): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
            "UPDATE movies SET title = ?, language = ?, overview = ?, poster_path = ?, rating = ?, rating_count = ?, release_date = ?, watched = ? WHERE id = ?",
            [movie.title, movie.language, movie.overview, movie.poster_path, movie.rating, movie.rating_count, movie.release_date, movie.watched ? movie.watched : false, movie.id],
            (err, res) => {
                if (err) reject(err);
                else resolve(res.affectedRows);
            }
            );
        });
    }

    delete(movieId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
            "DELETE FROM movies WHERE id = ?",
            [movieId],
            (err, res) => {
                if (err) reject(err);
                else resolve(res.affectedRows);
            }
            );
        });
    }
}

export default new MovieRepository();