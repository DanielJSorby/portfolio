<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { language } from '$lib/stores/language';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;
    
    let newTechName = '';
    let newTechColor = '#666666';
    let isGenerating = false;

    async function handleLogout() {
        await supabase.auth.signOut();
        window.location.href = '/login';
    }

    async function quickAddTech() {
        if (!newTechName) return;
        const { error } = await supabase
            .from('technologies')
            .insert({ name: newTechName, color: newTechColor });

        if (!error) {
            newTechName = '';
            newTechColor = '#666666';
            invalidateAll();
        } else {
            alert('Feil ved lagring: ' + error.message);
        }
    }

    async function handleGenerateColor() {
        if (!newTechName) return;
        isGenerating = true;
        try {
            const response = await fetch('/api/generate-color', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ techName: newTechName })
            });
            const resData = await response.json();
            if (resData.color) newTechColor = resData.color;
        } finally {
            isGenerating = false;
        }
    }
</script>

<div class="admin-dashboard">
    <header>
        <h1>Admin Dashboard</h1>
        <button on:click={handleLogout} class="btn danger">Logg ut</button>
    </header>

    <div class="dashboard-grid">
        <!-- Quick Settings Section -->
        <section class="quick-settings">
            <h2>Hurtiginnstillinger</h2>
            <div class="quick-actions-grid">
                <div class="card">
                    <h3>Hurtiglegg til teknologi</h3>
                    <div class="quick-form">
                        <input type="text" bind:value={newTechName} placeholder="Navn (f.eks. Svelte)" />
                        <div class="color-row">
                            <input type="color" bind:value={newTechColor} />
                            <button class="btn secondary small" on:click={handleGenerateColor} disabled={isGenerating}>
                                {isGenerating ? '...' : '✨ AI'}
                            </button>
                        </div>
                        <button class="btn primary small" on:click={quickAddTech}>Legg til</button>
                    </div>
                </div>

                <div class="card">
                    <h3>Navigasjon</h3>
                    <div class="nav-links">
                        <a href="/admin/projects" class="btn secondary">
                            📋 Alle Prosjekter
                        </a>
                        <a href="/admin/new" class="btn primary">
                            ➕ Nytt Prosjekt
                        </a>
                        <a href="/admin/tech" class="btn secondary">
                            🎨 Alle Teknologier
                        </a>
                        <a href="/admin/about" class="btn secondary">
                            👨‍💻 Erfaring & Utdanning
                        </a>
                        <a href="/admin/settings" class="btn secondary">
                            ⚙️ Sideinnstillinger
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Top Projects Management -->
        <section class="top-projects">
            <div class="section-header">
                <h2>Topp 4 Prosjekter</h2>
                <a href="/admin/projects" class="view-all">Se alle →</a>
            </div>
            
            <div class="mini-project-list">
                {#each data.topProjects as project}
                    <div class="mini-card">
                        <img src={project.image} alt="" />
                        <div class="info">
                            <h4>{project.title[$language]}</h4>
                            <div class="actions">
                                <a href="/admin/edit/{project.id}" class="icon-link">✏️</a>
                                <span class="placement">Plass: {(project.placement ?? 0) + 1}</span>
                            </div>
                        </div>
                    </div>
                {/each}
                {#if data.topProjects.length === 0}
                    <p class="empty">Ingen prosjekter ennå.</p>
                {/if}
            </div>
        </section>
    </div>
</div>

<style>
    .admin-dashboard {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        gap: 1rem;
    }

    @media (max-width: 600px) {
        header {
            flex-direction: column;
            text-align: center;
        }
        
        h1 {
            font-size: 2rem;
        }
    }

    h1 {
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 3rem;
    }

    .quick-actions-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    @media (max-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }

    @media (min-width: 768px) and (max-width: 1024px) {
        .quick-actions-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .card {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 20px;
        border: 1px solid var(--nav-bg);
        box-shadow: var(--card-shadow);
        margin-bottom: 1.5rem;
    }

    h3 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }

    .quick-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .color-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    input[type="text"] {
        padding: 0.75rem;
        border-radius: 10px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .view-all {
        color: var(--accent-primary);
        text-decoration: none;
        font-weight: 600;
    }

    .mini-project-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .mini-card {
        background: var(--bg-secondary);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid var(--nav-bg);
        transition: transform 0.3s;
    }

    .mini-card:hover {
        transform: translateY(-5px);
    }

    .mini-card img {
        width: 100%;
        height: 120px;
        object-fit: cover;
    }

    .mini-card .info {
        padding: 1rem;
    }

    .mini-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mini-card .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
    }

    .icon-link {
        text-decoration: none;
        background: var(--bg-primary);
        padding: 0.3rem 0.5rem;
        border-radius: 5px;
    }

    .placement {
        color: var(--text-secondary);
    }

    .btn {
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .btn.primary { background: var(--accent-primary); color: white; }
    .btn.secondary { background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--nav-bg); }
    .btn.danger { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .btn.small { padding: 0.5rem 1rem; font-size: 0.8rem; }

    .empty {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-secondary);
        padding: 3rem;
    }
</style>
