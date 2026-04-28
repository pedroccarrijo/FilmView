'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Movie } from '@/src/types/movie';
import '@/src/components/MovieModal/index.scss'; // Reaproveitando seu CSS do modal

export default function MovieDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getMovieDetails();
        }
    }, [id]);

    const getMovieDetails = () => {
        setLoading(true);
        axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/movie/${id}`,
            params: {
                api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
                language: 'pt-BR',
                append_to_response: 'videos'
            }
        }).then(response => {
            setMovie(response.data);
            setLoading(false);
        }).catch(error => {
            console.error("Erro ao buscar detalhes:", error);
            setLoading(false);
        });
    };

    if (loading) return <p style={{ color: 'white', padding: '2rem' }}>Carregando detalhes...</p>;
    if (!movie) return <p style={{ color: 'white', padding: '2rem' }}>Filme não encontrado.</p>;

    return (
        <main className="movie-details-page" style={{ minHeight: '100vh', backgroundColor: '#111' }}>
            {/* Botão para voltar */}
            <button 
                onClick={() => router.back()}
                style={{ margin: '2rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}
            >
                ← Voltar
            </button>

            {/* Aqui usamos a estrutura que você já tinha no Modal, mas agora em tela cheia */}
            <div className="modal-content" style={{ position: 'relative', margin: '0 auto', width: '90%' }}>
                <div className="modal-banner">
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                        alt={movie.title} 
                    />
                </div>
                
                <div className="modal-body">
                    <div className="modal-poster">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                        />
                    </div>

                    <div className="modal-info">
                        <h2>{movie.title || movie.name}</h2>
                        <div className="modal-meta">
                            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                            <span className="date">{new Date(movie.release_date || movie.first_air_date || '').getFullYear()}</span>
                        </div>
                        <p className="overview">{movie.overview}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}