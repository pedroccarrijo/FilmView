'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/src/types/movie';
import './index.scss';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

interface MovieDetails extends Movie {
    runtime?: number;
    genres?: { id: number; name: string }[];
    videos?: {
        results: { key: string; site: string; type: string }[];
    };
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        const fetchDetails = async () => {
            try {
                const type = movie.title ? 'movie' : 'tv';
                const response = await axios.get(
                    `https://api.themoviedb.org/3/${type}/${movie.id}`, 
                    {
                        params: {
                            api_key: API_KEY,
                            language: 'pt-BR',
                            append_to_response: 'videos'
                        }
                    }
                );
                setDetails(response.data);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            }
        };

        fetchDetails();

        return () => { document.body.style.overflow = 'unset'; };
    }, [movie.id]);

    const formatRuntime = (minutes?: number) => {
        if (!minutes) return '';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const trailer = details?.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>

                <div className="modal-banner" 
                     style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
                    <div className="banner-gradient"></div>
                </div>

                <div className="modal-body">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="modal-poster" />
                    
                    <div className="modal-info">
                        <h2>{movie.title || movie.name}</h2>
                        
                        <div className="modal-meta">
                            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                            <span className="year">{(movie.release_date || movie.first_air_date)?.substring(0, 4)}</span>
                            {details?.runtime && <span className="duration">{formatRuntime(details.runtime)}</span>}
                        </div>

                        <div className="modal-genres">
                            {details?.genres?.map(g => (
                                <span key={g.id} className="genre-pill">{g.name}</span>
                            ))}
                        </div>

                        <h3>Sinopse</h3>
                        <p className="overview">{movie.overview || "Sem sinopse disponível."}</p>

                        {trailer && (
                            <a 
                                href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-trailer"
                            >
                                Assistir Trailer
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}