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
</script>

<div class="admin-dashboard">
    <header>
        <div class="header-content">
            <a href="/admin" class="back-link">← Tilbake til Dashboard</a>
            <h1>Prosjekt Administrasjon</h1>
        </div>
        <div class="actions">
            <a href="/admin/new" class="btn primary">
                <span>+</span> Nytt Prosjekt
            </a>
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
                    <div class="drag-handle" title="Dra for å endre rekkefølge">⠿</div>
                    {#if project.image}
                        <img src={project.image} alt="" class="thumbnail" />
                    {:else}
                        <div class="thumbnail" style="background: var(--bg-primary); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 0.7rem; text-align: center; padding: 0.5rem;">Ingen bilde</div>
                    {/if}
                    <div class="details">
                        <h3>
                            {project.title[$language]}
                            {#if project.featured}
                                <span class="badge featured">Fremhevet</span>
                            {/if}
                        </h3>
                        <div class="tags">
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
                        class="btn small secondary" 
                        on:click={() => toggleFeatured(project)}
                    >
                        {project.featured ? 'Fjern fremheving' : 'Gjør fremhevet'}
                    </button>
                    <a href="/admin/edit/{project.id}" class="btn small secondary">Rediger</a>
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
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 3rem;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .header-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .back-link {
        color: var(--accent-primary);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    h1 {
        font-size: clamp(2rem, 5vw, 2.5rem);
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .project-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .project-item {
        background: var(--bg-secondary);
        padding: 1.25rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--card-shadow);
        cursor: grab;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
    }

    .project-item:hover {
        transform: translateY(-4px);
        border-color: var(--accent-primary);
        background: var(--nav-bg);
    }

    .project-item:active {
        cursor: grabbing;
    }

    .project-item.dragging {
        opacity: 0.5;
        background: var(--bg-primary);
        transform: scale(0.98);
        border-style: dashed;
        border-color: var(--accent-primary);
    }

    .drag-handle {
        color: var(--text-secondary);
        cursor: grab;
        font-size: 1.5rem;
        padding: 0 1rem;
        user-select: none;
        display: flex;
        align-items: center;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    .project-item:hover .drag-handle {
        opacity: 1;
    }

    .project-info {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex: 1;
    }

    .thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .details {
        flex: 1;
    }

    .details h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1.25rem;
        color: var(--text-primary);
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tech-tag {
        font-size: 0.75rem;
        background: var(--bg-primary);
        color: var(--text-secondary);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        border-left: 3px solid var(--accent-primary);
    }

    .badge.featured {
        background: var(--accent-primary);
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(var(--accent-primary-rgb), 0.3);
    }

    .controls {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        padding-left: 1.5rem;
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
        gap: 0.5rem;
    }

    .btn.primary { 
        background: var(--accent-primary); 
        color: white; 
    }
    
    .btn.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.3);
    }

    .btn.secondary { 
        background: transparent; 
        color: var(--text-primary);
        border: 2px solid var(--accent-primary);
    }

    .btn.secondary:hover {
        background: rgba(var(--accent-primary-rgb), 0.1);
        transform: translateY(-2px);
    }

    .btn.danger { 
        background: rgba(220, 38, 38, 0.1); 
        color: #dc2626;
        border: 1px solid rgba(220, 38, 38, 0.2);
    }

    .btn.danger:hover {
        background: #dc2626;
        color: white;
    }

    .btn.small { 
        padding: 0.5rem 1rem; 
        font-size: 0.8rem; 
    }

    .icon-btn {
        background: var(--bg-primary);
        border: 1px solid var(--nav-bg);
        border-radius: 12px;
        cursor: pointer;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        transition: all 0.2s;
    }

    .icon-btn:hover:not(:disabled) {
        background: var(--accent-primary);
        color: white;
        transform: scale(1.1);
    }

    .icon-btn:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    @media (max-width: 900px) {
        .project-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
            padding: 1.5rem;
        }

        .project-info {
            gap: 1.5rem;
        }

        .controls {
            padding-left: 0;
            padding-top: 1.5rem;
            border-top: 1px solid var(--nav-bg);
            justify-content: center;
            flex-wrap: wrap;
            width: 100%;
        }

        .btn.small {
            flex: 1;
            min-width: 120px;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .project-info {
            flex-direction: column;
            text-align: center;
        }

        .drag-handle {
            padding: 0;
            margin-bottom: 0.5rem;
        }

        .thumbnail {
            width: 100%;
            height: 150px;
        }

        .details h3 {
            font-size: 1.1rem;
        }
    }
</style>

