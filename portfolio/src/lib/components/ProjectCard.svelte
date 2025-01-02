<script lang="ts">
    import { language } from '$lib/stores/language';
    import { techColors } from '$lib/utils/techColors';
    import type { Project } from '$lib/types/project';
    import type { TechColors } from '$lib/types/techColors';

    export let project: Project;
    export let selectedTech: string = '';
    export let onTechClick: (tech: string) => void;

    function getTechColor(tech: string): string {
        return (techColors as TechColors)[tech] || '#666666';
    }
</script>

<div class="project-card">
    <div class="project-image">
        <img src={project.image} alt={project.title[$language]} />
    </div>
    <div class="project-content">
        <h2>{project.title[$language]}</h2>
        <p>{project.description[$language]}</p>
        <div class="tech-stack">
            {#each project.technologies as tech}
                <span 
                    class="tech-tag" 
                    class:highlight={selectedTech === tech}
                    style="--tech-color: {getTechColor(tech)}"
                    on:click={() => onTechClick(tech)}
                >
                    {tech}
                </span>
            {/each}
        </div>
        <a href={project.link} target="_blank" rel="noopener noreferrer">
            {$language === 'no' ? 'Les Mer' : 'Read More'} →
        </a>
    </div>
</div>

<style>
    .project-card {
        background-color: var(--bg-secondary);
        border-radius: 20px;
        box-shadow: var(--card-shadow);
        overflow: hidden;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        position: relative;
        z-index: 1;
        width: 100%;
    }

    .project-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent-primary);
    }

    .project-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 18px 18px 0 0;
    }

    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .project-card:hover .project-image img {
        transform: scale(1.05);
    }

    .project-content {
        padding: 1.5rem;
    }

    .project-content h2 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: clamp(1.25rem, 4vw, 1.5rem);
    }

    .project-content p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        font-size: clamp(0.9rem, 3vw, 1rem);
    }

    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
    }

    .tech-tag {
        background-color: var(--nav-bg);
        color: var(--nav-text);
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: clamp(0.75rem, 2vw, 0.875rem);
        transition: all 0.3s ease;
        border-left: 3px solid var(--tech-color);
        cursor: pointer;
    }

    .tech-tag:hover, .tech-tag.highlight {
        background-color: var(--tech-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }

    a {
        display: inline-block;
        margin-top: 1rem;
        text-decoration: none;
        color: var(--accent-primary);
        font-weight: 500;
        transition: color 0.2s;
    }

    a:hover {
        color: var(--accent-secondary);
    }

    @media (max-width: 768px) {
        .project-card:hover {
            transform: translateY(-4px);
        }

        .project-image {
            height: 180px;
        }

        .project-content {
            padding: 1.25rem;
        }

        .tech-stack {
            gap: 0.35rem;
        }
    }

    @media (max-width: 480px) {
        .project-image {
            height: 160px;
        }
    }
</style> 