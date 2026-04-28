'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Movie } from '@/src/types/movie';
import './page.scss'

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
        <main className="movie-details-page" style={{ minHeight: '100vh', backgroundColor: '#111' }}>
            
            {/* Botão de voltar imitando o layout nativo */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                <button 
                    onClick={() => router.back()}
                    style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#e50914', color: 'white', fontWeight: 'bold' }}
                >
                    ← Voltar
                </button>
            </div>

            {/* O seu conteúdo do modal exatamente como era antes */}
            <div className="modal-content" style={{ width: '100%', minHeight: '100vh', margin: 0, borderRadius: 0, border: 'none' }}>
                <div className="modal-banner" 
                     style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})` }}>
                    <div className="banner-gradient"></div>
                </div>

                <div className="modal-body" style={{ marginTop: '-150px' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} className="modal-poster" alt={details.title} />
                    
                    <div className="modal-info">
                        <h2>{details.title || details.name}</h2>
                        
                        <div className="modal-meta">
                            <span className="rating">⭐ {details.vote_average?.toFixed(1)}</span>
                            <span className="year">{(details.release_date || details.first_air_date)?.substring(0, 4)}</span>
                            {details.runtime && <span className="duration">{formatRuntime(details.runtime)}</span>}
                        </div>

                        <div className="modal-genres">
                            {details.genres?.map(g => (
                                <span key={g.id} className="genre-pill">{g.name}</span>
                            ))}
                        </div>

                        <h3>Sinopse</h3>
                        <p className="overview">{details.overview || "Sem sinopse disponível."}</p>

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
        </main>
    );
}