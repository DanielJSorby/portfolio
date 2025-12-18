<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { language } from '$lib/stores/language';
    import type { Project } from '$lib/types/project';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data: PageData;
    let localProjects: Project[] = [];
    let isUpdating = false;

    // Update local list when data changes, but only if we're not busy
    $: if (data.projects && !isUpdating) {
        localProjects = data.projects;
    }

    onMount(() => {
        const channel = supabase
            .channel('projects-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects'
                },
                () => {
                    if (!isUpdating) {
                        invalidateAll();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    });

    async function toggleFeatured(project: Project) {
        const { error } = await supabase
            .from('projects')
            .update({ featured: !project.featured })
            .eq('id', project.id);
        
        if (!error) invalidateAll();
    }

    async function reorderProjects(newOrderIds: (number | undefined)[]) {
        isUpdating = true;
        try {
            // 1. Move everything to a high temporary range
            for (let i = 0; i < newOrderIds.length; i++) {
                await supabase
                    .from('projects')
                    .update({ placement: 10000 + i })
                    .eq('id', newOrderIds[i]);
            }

            // 2. Move everything to their final positions (0, 1, 2...)
            for (let i = 0; i < newOrderIds.length; i++) {
                await supabase
                    .from('projects')
                    .update({ placement: i })
                    .eq('id', newOrderIds[i]);
            }

            await invalidateAll();
        } catch (error: any) {
            console.error('Reorder failed:', error);
            alert('Kunne ikke endre rekkefølge: ' + error.message);
        } finally {
            isUpdating = false;
        }
    }

    async function moveProject(project: Project, direction: 'up' | 'down') {
        const currentIndex = localProjects.findIndex(p => p.id === project.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= localProjects.length) return;

        // Instant local update
        const newProjects = [...localProjects];
        const [moved] = newProjects.splice(currentIndex, 1);
        newProjects.splice(targetIndex, 0, moved);
        localProjects = newProjects;

        await reorderProjects(localProjects.map(p => p.id));
    }

    async function deleteProject(id: number) {
        if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (!error) invalidateAll();
    }

    let draggedItemIndex: number | null = null;

    function handleDragStart(index: number) {
        draggedItemIndex = index;
    }

    async function handleDragOver(e: DragEvent, index: number) {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
    }

    async function handleDrop(targetIndex: number) {
        if (draggedItemIndex === null || draggedItemIndex === targetIndex) {
            draggedItemIndex = null;
            return;
        }

        // Instant local update
        const newProjects = [...localProjects];
        const [movedProject] = newProjects.splice(draggedItemIndex, 1);
        newProjects.splice(targetIndex, 0, movedProject);
        localProjects = newProjects;

        const newOrderIds = localProjects.map(p => p.id);
        draggedItemIndex = null;
        
        await reorderProjects(newOrderIds);
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
            <a href="/admin/tech" class="btn secondary">Administrer Teknologier</a>
            <a href="/admin/new" class="btn primary">Nytt Prosjekt</a>
            <button on:click={handleLogout} class="btn secondary">Logg ut</button>
        </div>
    </header>

    <div class="project-list">
        {#each localProjects as project, i (project.id)}
            <div 
                class="project-item"
                draggable="true"
                role="listitem"
                on:dragstart={() => handleDragStart(i)}
                on:dragover={(e) => handleDragOver(e, i)}
                on:drop={() => handleDrop(i)}
                class:dragging={draggedItemIndex === i}
            >
                <div class="project-info">
                    <span class="drag-handle" title="Dra for å endre rekkefølge">⋮⋮</span>
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
                        disabled={i === localProjects.length - 1} 
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
        cursor: grab;
        transition: transform 0.2s, background-color 0.2s;
    }

    .project-item:active {
        cursor: grabbing;
    }

    .project-item.dragging {
        opacity: 0.5;
        background: var(--bg-primary);
        transform: scale(0.98);
    }

    .drag-handle {
        color: var(--text-secondary);
        cursor: grab;
        font-size: 1.2rem;
        padding: 0 0.5rem;
        user-select: none;
    }

    .project-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
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
