<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;
    
    let editingExpId: number | null = null;
    let editingEduId: number | null = null;

    // Experience management
    let newExp = { title_no: '', title_en: '', company: '', date_no: '', date_en: '', description_no: '', description_en: '' };
    async function addExperience() {
        const { error } = await supabase
            .from('experience')
            .insert({ ...newExp, placement: data.experience.length });
        if (!error) {
            newExp = { title_no: '', title_en: '', company: '', date_no: '', date_en: '', description_no: '', description_en: '' };
            invalidateAll();
        }
    }

    async function updateExperience(exp: any) {
        const { error } = await supabase
            .from('experience')
            .update(exp)
            .eq('id', exp.id);
        
        if (!error) {
            editingExpId = null;
            invalidateAll();
        }
    }

    async function deleteExp(id: number) {
        if (confirm('Slette denne erfaringen?')) {
            await supabase.from('experience').delete().eq('id', id);
            invalidateAll();
        }
    }

    // Education management
    let newEdu = { title_no: '', title_en: '', institution: '', date: '' };
    async function addEducation() {
        const { error } = await supabase
            .from('education')
            .insert({ ...newEdu, placement: data.education.length });
        if (!error) {
            newEdu = { title_no: '', title_en: '', institution: '', date: '' };
            invalidateAll();
        }
    }

    async function updateEducation(edu: any) {
        const { error } = await supabase
            .from('education')
            .update(edu)
            .eq('id', edu.id);
        
        if (!error) {
            editingEduId = null;
            invalidateAll();
        }
    }

    async function deleteEdu(id: number) {
        if (confirm('Slette denne utdanningen?')) {
            await supabase.from('education').delete().eq('id', id);
            invalidateAll();
        }
    }
</script>

<div class="admin-container">
    <header>
        <div class="header-content">
            <a href="/admin" class="back-link">← Tilbake til Dashboard</a>
            <h1>Om meg Administrasjon</h1>
        </div>
    </header>

    <div class="sections">
        <!-- Experience Section -->
        <section class="card">
            <h2>Erfaring (Experience)</h2>
            <div class="add-form">
                <h3>Legg til ny</h3>
                <div class="input-grid">
                    <input type="text" bind:value={newExp.title_no} placeholder="Tittel (NO)" />
                    <input type="text" bind:value={newExp.title_en} placeholder="Title (EN)" />
                    <input type="text" bind:value={newExp.company} placeholder="Selskap/Firma" />
                    <input type="text" bind:value={newExp.date_no} placeholder="Dato (f.eks. 2024 - Nå)" />
                    <input type="text" bind:value={newExp.date_en} placeholder="Date (e.g. 2024 - Present)" />
                </div>
                <textarea bind:value={newExp.description_no} placeholder="Beskrivelse (NO)"></textarea>
                <textarea bind:value={newExp.description_en} placeholder="Description (EN)"></textarea>
                <button class="btn primary" on:click={addExperience}>Legg til erfaring</button>
            </div>

            <div class="list">
                {#each data.experience as exp}
                    <div class="item-container">
                        {#if editingExpId === exp.id}
                            <div class="edit-form">
                                <div class="input-grid">
                                    <input type="text" bind:value={exp.title_no} placeholder="Tittel (NO)" />
                                    <input type="text" bind:value={exp.title_en} placeholder="Title (EN)" />
                                    <input type="text" bind:value={exp.company} placeholder="Selskap" />
                                    <input type="text" bind:value={exp.date_no} placeholder="Dato (NO)" />
                                    <input type="text" bind:value={exp.date_en} placeholder="Date (EN)" />
                                </div>
                                <textarea bind:value={exp.description_no} placeholder="Beskrivelse (NO)"></textarea>
                                <textarea bind:value={exp.description_en} placeholder="Description (EN)"></textarea>
                                <div class="edit-actions">
                                    <button class="btn primary small" on:click={() => updateExperience(exp)}>Lagre</button>
                                    <button class="btn secondary small" on:click={() => editingExpId = null}>Avbryt</button>
                                </div>
                            </div>
                        {:else}
                            <div class="item">
                                <div class="info">
                                    <strong>{exp.title_no}</strong> @ {exp.company}
                                    <p>{exp.date_no}</p>
                                </div>
                                <div class="actions">
                                    <button class="btn secondary small" on:click={() => editingExpId = Number(exp.id)}>Rediger</button>
                                    <button class="btn danger small" on:click={() => deleteExp(exp.id)}>Slett</button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>

        <!-- Education Section -->
        <section class="card">
            <h2>Utdanning (Education)</h2>
            <div class="add-form">
                <h3>Legg til ny</h3>
                <div class="input-grid">
                    <input type="text" bind:value={newEdu.title_no} placeholder="Tittel/Grad (NO)" />
                    <input type="text" bind:value={newEdu.title_en} placeholder="Title/Degree (EN)" />
                    <input type="text" bind:value={newEdu.institution} placeholder="Institusjon" />
                    <input type="text" bind:value={newEdu.date} placeholder="Dato (f.eks. 2023 - 2026)" />
                </div>
                <button class="btn primary" on:click={addEducation}>Legg til utdanning</button>
            </div>

            <div class="list">
                {#each data.education as edu}
                    <div class="item-container">
                        {#if editingEduId === edu.id}
                            <div class="edit-form">
                                <div class="input-grid">
                                    <input type="text" bind:value={edu.title_no} />
                                    <input type="text" bind:value={edu.title_en} />
                                    <input type="text" bind:value={edu.institution} />
                                    <input type="text" bind:value={edu.date} />
                                </div>
                                <div class="edit-actions">
                                    <button class="btn primary small" on:click={() => updateEducation(edu)}>Lagre</button>
                                    <button class="btn secondary small" on:click={() => editingEduId = null}>Avbryt</button>
                                </div>
                            </div>
                        {:else}
                            <div class="item">
                                <div class="info">
                                    <strong>{edu.title_no}</strong>
                                    <p>{edu.institution} ({edu.date})</p>
                                </div>
                                <div class="actions">
                                    <button class="btn secondary small" on:click={() => editingEduId = Number(edu.id)}>Rediger</button>
                                    <button class="btn danger small" on:click={() => deleteEdu(edu.id)}>Slett</button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>
    </div>
</div>

<style>
    .admin-container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    header { margin-bottom: 3rem; }
    
    .back-link {
        color: var(--accent-primary);
        text-decoration: none;
        font-weight: 600;
        display: block;
        margin-bottom: 0.5rem;
    }

    h1 {
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .sections {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .card {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 24px;
        border: 1px solid var(--nav-bg);
        box-shadow: var(--card-shadow);
    }

    h2 { margin-bottom: 2rem; color: var(--text-primary); }
    h3 { font-size: 1rem; color: var(--text-secondary); margin-bottom: 1rem; }

    .add-form, .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: var(--bg-primary);
        padding: 1.5rem;
        border-radius: 16px;
        margin-bottom: 2rem;
    }

    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    @media (max-width: 600px) {
        .input-grid { grid-template-columns: 1fr; }
    }

    input, textarea {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-secondary);
        color: var(--text-primary);
        width: 100%;
    }

    .list { display: flex; flex-direction: column; gap: 1rem; }

    .item-container {
        background: var(--bg-primary);
        border-radius: 12px;
        overflow: hidden;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
    }

    .info strong { display: block; color: var(--accent-primary); }
    .info p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); }

    .actions, .edit-actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        white-space: nowrap;
    }

    .btn.primary { background: var(--accent-primary); color: white; }
    .btn.secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--nav-bg); }
    .btn.danger { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .btn.small { padding: 0.5rem 1rem; font-size: 0.8rem; }
</style>

