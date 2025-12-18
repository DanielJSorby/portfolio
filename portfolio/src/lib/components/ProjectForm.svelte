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
            goto('/admin/projects');
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
        <a href="/admin/projects" class="btn secondary">Avbryt</a>
    </div>
</form>

<style>
    .project-form {
        background: var(--bg-secondary);
        padding: 3rem;
        border-radius: 30px;
        box-shadow: var(--card-shadow);
        display: flex;
        flex-direction: column;
        gap: 2rem;
        border: 1px solid var(--nav-bg);
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
    }

    @media (max-width: 900px) {
        .grid { grid-template-columns: 1fr; }
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .label-text {
        display: block;
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.95rem;
    }

    .form-group.checkbox {
        margin-top: 1rem;
        background: var(--bg-primary);
        padding: 1rem 1.5rem;
        border-radius: 15px;
        border: 1px solid var(--nav-bg);
        width: fit-content;
    }

    .form-group.checkbox label {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
    }

    .form-group.checkbox input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    input[type="text"], textarea {
        width: 100%;
        padding: 1rem 1.25rem;
        border-radius: 15px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    input[type="text"]:focus, textarea:focus {
        border-color: var(--accent-primary);
        outline: none;
        box-shadow: 0 0 0 4px rgba(var(--accent-primary-rgb), 0.1);
    }

    .tech-selection {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 1.5rem;
        background: var(--bg-primary);
        border-radius: 20px;
        border: 1px solid var(--nav-bg);
    }

    .tech-tag {
        background-color: var(--bg-secondary);
        color: var(--text-secondary);
        padding: 0.5rem 1.25rem;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        border-left: 4px solid var(--tech-color);
        cursor: pointer;
        opacity: 0.7;
    }

    .tech-tag.active {
        background-color: var(--tech-color);
        color: white;
        opacity: 1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .tech-tag:hover:not(.active) {
        opacity: 1;
        border-color: var(--tech-color);
        background: var(--bg-primary);
    }

    .add-new-tech {
        font-size: 0.9rem;
        color: var(--accent-primary);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        margin-left: 1rem;
        font-weight: 600;
        transition: all 0.2s;
    }

    .add-new-tech:hover {
        transform: translateX(4px);
    }

    .actions {
        display: flex;
        gap: 1.5rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--nav-bg);
    }

    @media (max-width: 600px) {
        .actions {
            flex-direction: column;
            gap: 1rem;
        }

        .btn {
            width: 100%;
        }

        .project-form {
            padding: 1.5rem;
        }

        h2 {
            font-size: 1.25rem;
        }
    }

    .btn {
        padding: 1rem 2.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn.primary { 
        background: var(--accent-primary); 
        color: white;
        box-shadow: 0 4px 15px rgba(var(--accent-primary-rgb), 0.3);
    }
    
    .btn.primary:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(var(--accent-primary-rgb), 0.4);
    }

    .btn.secondary { 
        background: transparent; 
        color: var(--text-primary);
        border: 2px solid var(--nav-bg);
    }

    .btn.secondary:hover {
        background: var(--bg-primary);
        border-color: var(--accent-primary);
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: wait;
    }
</style>
