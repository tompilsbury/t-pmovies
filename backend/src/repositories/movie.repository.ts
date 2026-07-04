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
                "INSERT INTO movies (title, image, watched) VALUES (?,?,?)",
                [movie.title, movie.image, movie.watched ? movie.watched : false],
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
            "UPDATE movies SET title = ?, image = ?, watched = ? WHERE id = ?",
            [movie.title, movie.description, movie.published, movie.id],
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