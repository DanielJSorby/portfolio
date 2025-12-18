<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import type { Project } from '$lib/types/project';

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
    let techString = project.technologies.join(', ');

    async function handleSubmit() {
        loading = true;
        project.technologies = techString.split(',').map(t => t.trim()).filter(t => t !== '');

        const { error } = await supabase
            .from('projects')
            .upsert(project);

        if (error) {
            alert('Feil ved lagring: ' + error.message);
            loading = false;
        } else {
            goto('/admin');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="project-form">
    <div class="grid">
        <section>
            <h2>Norsk (NO)</h2>
            <div class="form-group">
                <label>Tittel (NO)</label>
                <input type="text" bind:value={project.title.no} required />
            </div>
            <div class="form-group">
                <label>Beskrivelse (NO)</label>
                <textarea bind:value={project.description.no} required rows="4"></textarea>
            </div>
        </section>

        <section>
            <h2>English (EN)</h2>
            <div class="form-group">
                <label>Title (EN)</label>
                <input type="text" bind:value={project.title.en} required />
            </div>
            <div class="form-group">
                <label>Description (EN)</label>
                <textarea bind:value={project.description.en} required rows="4"></textarea>
            </div>
        </section>
    </div>

    <div class="form-group">
        <label>Teknologier (separert med komma)</label>
        <input type="text" bind:value={techString} placeholder="SvelteKit, TypeScript, Supabase" />
    </div>

    <div class="form-group">
        <label>Bilde-URL</label>
        <input type="text" bind:value={project.image} required />
    </div>

    <div class="form-group">
        <label>Lenke (GitHub/Live)</label>
        <input type="text" bind:value={project.link} required />
    </div>

    <div class="row">
        <div class="form-group">
            <label>Rekkefølge (Placement)</label>
            <input type="number" bind:value={project.placement} />
        </div>
        <div class="form-group checkbox">
            <label>
                <input type="checkbox" bind:checked={project.featured} />
                Featured Prosjekt
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

    .form-group.checkbox {
        flex-direction: row;
        align-items: center;
        margin-top: 1.5rem;
    }

    .form-group.checkbox label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    label {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    input[type="text"], input[type="number"], textarea {
        padding: 0.75rem;
        border-radius: 10px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
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

