import ExploreList from '@/src/components/ExplorerList';

export default function FilmesPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center'}}>Explorar Filmes</h2>
            <ExploreList type="movie" />
        </main>
    );
}