<script lang="ts">
    import ProjectCard from './ProjectCard.svelte';
    import { supabase } from '$lib/supabaseClient';
    import { language } from '$lib/stores/language';
    import type { Project } from '$lib/types/project';
    import { onMount } from 'svelte';

    export let selectedTech: string = '';
    export let limit: number | undefined = undefined;

    let projects: Project[] = [];
    let loading = true;

    onMount(async () => {
        try {
            // Fetch projects
            const { data: projData, error: projError } = await supabase
                .from('projects')
                .select('*')
                .order('placement', { ascending: true });
            
            if (!projError && projData) {
                projects = projData as unknown as Project[];
            }

            // Fetch tech colors
            const { data: techData, error: techError } = await supabase
                .from('technologies')
                .select('*');
            
            if (!techError && techData) {
                techData.forEach(t => {
                    dbTechColors[t.name] = t.color;
                });
            }
        } finally {
            loading = false;
        }
    });

    let dbTechColors: Record<string, string> = {};

    function getTechColor(tech: string): string {
        return dbTechColors[tech] || '#666666';
    }


    $: filteredProjects = selectedTech 
        ? projects.filter((project: Project) => project.technologies.includes(selectedTech))
        : projects;

    $: displayedProjects = limit 
        ? filteredProjects.slice(0, limit)
        : filteredProjects;

    function handleTechClick(tech: string): void {
        selectedTech = selectedTech === tech ? '' : tech;
    }
</script>

<div class="project-grid">
    {#if loading}
        <p class="loading">
            {$language === 'no' ? 'Laster prosjekter...' : 'Loading projects...'}
        </p>
    {:else if displayedProjects.length === 0}
        <p class="no-projects">
            {$language === 'no' 
                ? 'Ingen prosjekter funnet for valgt teknologi.' 
                : 'No projects found for selected technology.'}
        </p>
    {:else}
        {#each displayedProjects as project}
        <ProjectCard 
            {project} 
            {selectedTech}
            onTechClick={handleTechClick}
            getTechColor={getTechColor}
        />
        {/each}
    {/if}
</div>

<style>
    .loading {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-secondary);
        padding: 2rem;
    }
    .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        width: 100%;
        margin: 2rem 0;
    }

    .no-projects {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-secondary);
        font-size: 1.1rem;
        padding: 2rem;
    }

    @media (max-width: 768px) {
        .project-grid {
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
    }

    @media (max-width: 480px) {
        .project-grid {
            gap: 1rem;
            grid-template-columns: 1fr;
        }
    }
</style> 