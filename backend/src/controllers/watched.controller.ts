import { Request, Response } from 'express';
import watchedRepository from '../repositories/watched.repository';

export class WatchedController {
    public save = async (req: Request, res: Response) => {
        const {movieId, rating, notes} = req.body;

        if (!movieId) {
            res.status(400).json({message: "movieId is required."});
            return;
        }
        
        const newWatchedMovie = await watchedRepository.save(movieId, rating, notes);

        return res.status(201).json(newWatchedMovie); 
    };

    public findAll = async (req: Request, res: Response) => {
        const allWatchedMovies = await watchedRepository.retrieveAll();
        return res.status(200).json(allWatchedMovies);
    };

    public findById = async (req: Request, res: Response) => {
        const {movieId} = req.params;
        const id = Number(movieId);

        const movie = await watchedRepository.retrieveById(id);
        if (!movie) {
            res.status(404).json({message: 'Watched movie not found.'});
            return;
        }

        res.status(200).json(movie);
    };

    public update = async (req: Request, res: Response) => {
        const {movieId} = req.params;
        const id = Number(movieId);
        const {rating, notes} = req.body;

        const movie = await watchedRepository.retrieveById(id);
        if (!movie) {
            res.status(404).json({message: 'Watched movie not found.'});
            return;
        }
        movie.rating = rating ? rating : movie.rating;
        movie.notes = notes ? notes : movie.notes;

        const updatedMovie = await watchedRepository.update(movie);
        res.status(200).json(updatedMovie);
    };

    public delete = async (req: Request, res: Response) => {
        const {movieId} = req.params;
        const id = Number(movieId);

        const rowsDeleted = await watchedRepository.delete(id);
        if (rowsDeleted <= 0 ) {
            res.status(404).json({message: 'Watched movie not found.'});
            return;
        }

        res.status(204).send();
    };
}
