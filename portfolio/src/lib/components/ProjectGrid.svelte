<script lang="ts">
    import ProjectCard from './ProjectCard.svelte';
    import projectsData from '$lib/data/projects.json';
    import { language } from '$lib/stores/language';
    import type { Project } from '$lib/types/project';

    export let selectedTech: string = '';
    export let limit: number | undefined = undefined;

    const projects: Project[] = projectsData.projects;

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
    {#if displayedProjects.length === 0}
        <p class="no-projects">
            {$language === 'no' 
                ? 'Ingen prosjekter funnet for valgt teknologi.' 
                : 'No projects found for selected technology.'}
        </p>
    {/if}
    {#each displayedProjects as project}
        <ProjectCard 
            {project} 
            {selectedTech}
            onTechClick={handleTechClick}
        />
    {/each}
</div>

<style>
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