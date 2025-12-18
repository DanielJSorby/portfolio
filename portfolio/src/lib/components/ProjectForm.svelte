<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto, invalidateAll } from '$app/navigation';
    import type { Project } from '$lib/types/project';
    import { onMount } from 'svelte';

    export let project: Project = {
        title: { no: '', en: '' },
        description: { no: '', en: '' },
        technologies: [],
        image: '',
        link: '',
        placement: 0,
        featured: false
    };

    let loading = false;
    let availableTechnologies: any[] = [];

    onMount(async () => {
        const { data } = await supabase
            .from('technologies')
            .select('*')
            .order('name');
        if (data) availableTechnologies = data;
    });

    function toggleTechnology(techName: string) {
        if (project.technologies.includes(techName)) {
            project.technologies = project.technologies.filter(t => t !== techName);
        } else {
            project.technologies = [...project.technologies, techName];
        }
    }

    async function handleSubmit() {
        loading = true;
        
        // If it's a new project (no id), assign the next available placement
        if (!project.id) {
            const { data: countData } = await supabase
                .from('projects')
                .select('placement')
                .order('placement', { ascending: false })
                .limit(1);
            
            const lastPlacement = countData?.[0]?.placement ?? -1;
            project.placement = lastPlacement + 1;
        }

        const { error } = await supabase
            .from('projects')
            .upsert(project);

        if (error) {
            alert('Feil ved lagring: ' + error.message);
            loading = false;
        } else {
            await invalidateAll();
            goto('/admin');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="project-form">
    <div class="grid">
        <section>
            <h2>Norsk (NO)</h2>
            <div class="form-group">
                <label for="title-no" class="label-text">Tittel (NO)</label>
                <input type="text" id="title-no" bind:value={project.title.no} required />
            </div>
            <div class="form-group">
                <label for="desc-no" class="label-text">Beskrivelse (NO)</label>
                <textarea id="desc-no" bind:value={project.description.no} required rows="4"></textarea>
            </div>
        </section>

        <section>
            <h2>English (EN)</h2>
            <div class="form-group">
                <label for="title-en" class="label-text">Title (EN)</label>
                <input type="text" id="title-en" bind:value={project.title.en} required />
            </div>
            <div class="form-group">
                <label for="desc-en" class="label-text">Description (EN)</label>
                <textarea id="desc-en" bind:value={project.description.en} required rows="4"></textarea>
            </div>
        </section>
    </div>

    <div class="form-group">
        <span class="label-text">Velg Teknologier</span>
        <div class="tech-selection">
            {#each availableTechnologies as tech}
                <button 
                    type="button"
                    class="tech-tag" 
                    class:active={project.technologies.includes(tech.name)}
                    style="--tech-color: {tech.color}"
                    on:click={() => toggleTechnology(tech.name)}
                >
                    {tech.name}
                </button>
            {/each}
            <a href="/admin/tech" class="add-new-tech">+ Legg til ny teknologi</a>
        </div>
    </div>

    <div class="form-group">
        <label for="image-url" class="label-text">Bilde-URL</label>
        <input type="text" id="image-url" bind:value={project.image} required />
    </div>

    <div class="form-group">
        <label for="link-url" class="label-text">Lenke (GitHub/Live)</label>
        <input type="text" id="link-url" bind:value={project.link} required />
    </div>

    <div class="row">
        <div class="form-group checkbox">
            <label>
                <input type="checkbox" bind:checked={project.featured} />
                <span class="label-text">Featured Prosjekt</span>
            </label>
        </div>
    </div>

    <div class="actions">
        <button type="submit" class="btn primary" disabled={loading}>
            {loading ? 'Lagrer...' : 'Lagre Prosjekt'}
        </button>
        <a href="/admin" class="btn secondary">Avbryt</a>
    </div>
</form>

<style>
    .project-form {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: var(--card-shadow);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        .grid { grid-template-columns: 1fr; }
    }

    h2 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--accent-primary);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label-text {
        display: block;
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .form-group.checkbox {
        margin-top: 1.5rem;
    }

    .form-group.checkbox label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .form-group.checkbox .label-text {
        margin-bottom: 0;
    }

    input[type="text"], textarea {
        width: 100%;
        padding: 0.75rem;
        border-radius: 10px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    .tech-selection {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 1rem;
        background: var(--bg-primary);
        border-radius: 12px;
        border: 1px solid var(--nav-bg);
    }

    .tech-tag {
        background-color: var(--nav-bg);
        color: var(--nav-text);
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        border: none;
        border-left: 3px solid var(--tech-color);
        cursor: pointer;
        opacity: 0.6;
    }

    .tech-tag.active {
        background-color: var(--tech-color);
        color: white;
        opacity: 1;
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }

    .tech-tag:hover {
        opacity: 1;
    }

    .add-new-tech {
        font-size: 0.8rem;
        color: var(--accent-primary);
        text-decoration: none;
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .add-new-tech:hover {
        text-decoration: underline;
    }

    .row {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }

    .actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .btn {
        padding: 0.8rem 2rem;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 1rem;
    }

    .btn.primary { background: var(--accent-primary); color: white; }
    .btn.secondary { background: var(--bg-primary); color: var(--text-primary); }
</style>
