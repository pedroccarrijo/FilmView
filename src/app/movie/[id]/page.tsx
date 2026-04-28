'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Movie } from '@/src/types/movie';
import './page.scss'; 

interface MovieDetails extends Movie {
    runtime?: number;
    genres?: { id: number; name: string }[];
    videos?: {
        results: { key: string; site: string; type: string }[];
    };
}

export default function MovieDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}`, 
                    {
                        params: {
                            api_key: API_KEY,
                            language: 'pt-BR',
                            append_to_response: 'videos'
                        }
                    }
                );
                setDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, API_KEY]);

    const formatRuntime = (minutes?: number) => {
        if (!minutes) return '';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) return <p style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Carregando detalhes...</p>;
    if (!details) return <p style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Filme não encontrado.</p>;

    const trailer = details.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");

    return (
        <main className="movie-details-page">
            
            {/* Botão de voltar aprimorado */}
            <button className="back-btn" onClick={() => router.back()}>
                ← Voltar
            </button>

            {/* Fundo Gigante com Gradiente */}
            <div className="hero-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})` }}>
                <div className="gradient-overlay"></div>
            </div>

            {/* Container Principal de Conteúdo */}
            <div className="content-container">
                
                {/* Parte Superior: Poster + Textos */}
                <div className="header-content">
                    <img src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} className="poster" alt={details.title} />
                    
                    <div className="info">
                        <h1>{details.title || details.name}</h1>
                        
                        <div className="meta">
                            <span className="rating">⭐ {details.vote_average?.toFixed(1)}</span>
                            <span className="year">{(details.release_date || details.first_air_date)?.substring(0, 4)}</span>
                            {details.runtime && <span className="duration">{formatRuntime(details.runtime)}</span>}
                        </div>

                        <div className="genres">
                            {details.genres?.map(g => (
                                <span key={g.id} className="genre-tag">{g.name}</span>
                            ))}
                        </div>

                        <h2>Sinopse</h2>
                        <p className="overview">{details.overview || "Sem sinopse disponível."}</p>
                    </div>
                </div>

                {/* Parte Inferior: Trailer Embutido */}
                {trailer && (
                    <div className="trailer-section">
                        <h2>Trailer Oficial</h2>
                        <div className="video-wrapper">
                            <iframe 
                                src={`https://www.youtube.com/embed/${trailer.key}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}