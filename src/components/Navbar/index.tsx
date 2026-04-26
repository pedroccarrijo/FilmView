'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './index.scss';

export default function Navbar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (query.trim() !== '') {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setQuery('');
        }
    }

    return (
        <nav className="navbar">
            <Link href="/" className="page-title-link">
                <h1 className="page-title">FilmView</h1>
            </Link>
            
            <div className='options-menu'>
                <Link href="/filmes" className="menu-item">Filmes</Link>
                <Link href="/series" className="menu-item">Séries</Link>
            </div>
            
            <form className='search' onSubmit={handleSearch}>
                <input 
                    className="search-movie" 
                    type="text" 
                    placeholder='O que você procura?'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className='button-search-movie' type='submit'>
                    Buscar
                </button>
            </form>
        </nav>
    )
}