<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { language } from '$lib/stores/language';
    import type { Project } from '$lib/types/project';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;
    $: projects = data.projects;

    async function toggleFeatured(project: Project) {
        const { error } = await supabase
            .from('projects')
            .update({ featured: !project.featured })
            .eq('id', project.id);
        
        if (!error) invalidateAll();
    }

    async function moveProject(project: Project, direction: 'up' | 'down') {
        const currentIndex = projects.findIndex(p => p.id === project.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= projects.length) return;

        const targetProject = projects[targetIndex];
        
        const currentPlacement = project.placement || 0;
        const targetPlacement = targetProject.placement || 0;

        // Use a temporary placement to avoid unique constraint violation during swap
        const tempPlacement = -999;

        // 1. Set current project to temp
        const { error: err1 } = await supabase.from('projects')
            .update({ placement: tempPlacement })
            .eq('id', project.id);
        
        if (err1) {
            console.error('Swap step 1 failed:', err1);
            return;
        }

        // 2. Set target project to current project's old placement
        const { error: err2 } = await supabase.from('projects')
            .update({ placement: currentPlacement })
            .eq('id', targetProject.id);

        if (err2) {
            console.error('Swap step 2 failed:', err2);
            // Try to recover
            await supabase.from('projects').update({ placement: currentPlacement }).eq('id', project.id);
            return;
        }

        // 3. Set current project to target project's old placement
        const { error: err3 } = await supabase.from('projects')
            .update({ placement: targetPlacement })
            .eq('id', project.id);

        if (err3) {
            console.error('Swap step 3 failed:', err3);
        }

        invalidateAll();
    }

    async function deleteProject(id: number) {
        if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (!error) invalidateAll();
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        window.location.href = '/login';
    }
</script>

<div class="admin-dashboard">
    <header>
        <h1>Prosjekt Administrasjon</h1>
        <div class="actions">
            <a href="/admin/new" class="btn primary">Nytt Prosjekt</a>
            <button on:click={handleLogout} class="btn secondary">Logg ut</button>
        </div>
    </header>

    <div class="project-list">
        {#each projects as project, i}
            <div class="project-item">
                <div class="project-info">
                    <span class="placement">#{project.placement}</span>
                    <img src={project.image} alt="" class="thumbnail" />
                    <div class="details">
                        <h3>{project.title[$language]}</h3>
                        <div class="tags">
                            {#if project.featured}
                                <span class="badge featured">Featured</span>
                            {/if}
                            {#each project.technologies as tech}
                                <span class="tech-tag">{tech}</span>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="controls">
                    <button 
                        class="icon-btn" 
                        disabled={i === 0} 
                        on:click={() => moveProject(project, 'up')}
                        title="Flytt opp"
                    >↑</button>
                    <button 
                        class="icon-btn" 
                        disabled={i === projects.length - 1} 
                        on:click={() => moveProject(project, 'down')}
                        title="Flytt ned"
                    >↓</button>
                    <button 
                        class="btn small" 
                        on:click={() => toggleFeatured(project)}
                    >
                        {project.featured ? 'Fjern Featured' : 'Gjør Featured'}
                    </button>
                    <a href="/admin/edit/{project.id}" class="btn small">Rediger</a>
                    <button 
                        class="btn small danger" 
                        on:click={() => project.id && deleteProject(project.id)}
                    >Slett</button>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .admin-dashboard {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .actions {
        display: flex;
        gap: 1rem;
    }

    .project-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .project-item {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--card-shadow);
    }

    .project-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .placement {
        font-weight: bold;
        color: var(--text-secondary);
        width: 30px;
    }

    .thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
    }

    .details h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tech-tag {
        font-size: 0.75rem;
        background: var(--bg-primary);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }

    .badge.featured {
        background: var(--accent-primary);
        color: white;
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-weight: bold;
    }

    .controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
    }

    .btn.primary { background: var(--accent-primary); color: white; }
    .btn.secondary { background: var(--bg-primary); color: var(--text-primary); }
    .btn.danger { background: #fee2e2; color: #dc2626; }
    .btn.small { padding: 0.3rem 0.6rem; font-size: 0.8rem; }

    .icon-btn {
        background: none;
        border: 1px solid var(--nav-bg);
        border-radius: 4px;
        cursor: pointer;
        padding: 2px 8px;
        color: var(--text-primary);
    }

    .icon-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
</style>

