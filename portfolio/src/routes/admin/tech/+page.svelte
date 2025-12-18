<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';

    export let data: PageData;
    $: technologies = data.technologies;

    onMount(() => {
        // Set up realtime subscription for technologies
        const channel = supabase
            .channel('tech-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'technologies'
                },
                () => {
                    console.log('Technologies changed, invalidating data...');
                    invalidateAll();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    });

    let newTechName = '';
    let newTechColor = '#666666';
    let isGenerating = false;

    async function handleGenerateColor() {
        if (!newTechName) {
            alert('Skriv inn navnet på teknologien først');
            return;
        }
        
        isGenerating = true;
        console.log('Genererer farge for:', newTechName);
        
        try {
            const response = await fetch('/api/generate-color', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ techName: newTechName })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Serverfeil');
            }
            
            const data = await response.json();
            console.log('Mottatt farge:', data.color);
            
            if (data.color) {
                newTechColor = data.color;
            } else {
                alert('Fikk ingen farge fra AI-en');
            }
        } catch (error: any) {
            console.error('Genereringsfeil:', error);
            alert('Kunne ikke generere farge: ' + error.message);
        } finally {
            isGenerating = false;
        }
    }

    async function addTech() {
        if (!newTechName) return;
        
        const { error } = await supabase
            .from('technologies')
            .insert({ name: newTechName, color: newTechColor });

        if (!error) {
            newTechName = '';
            newTechColor = '#666666';
            invalidateAll();
        } else {
            alert('Feil ved lagring: ' + error.message);
        }
    }

    async function updateColor(name: string, color: string) {
        const { error } = await supabase
            .from('technologies')
            .update({ color })
            .eq('name', name);
        
        if (!error) invalidateAll();
    }

    async function deleteTech(name: string) {
        if (!confirm(`Slette ${name}?`)) return;
        
        const { error } = await supabase
            .from('technologies')
            .delete()
            .eq('name', name);
        
        if (!error) invalidateAll();
    }
</script>

<div class="tech-admin">
    <header>
        <h1>Teknologier & Farger</h1>
        <a href="/admin" class="btn secondary">Tilbake til Admin</a>
    </header>

    <div class="add-tech">
        <div class="input-group">
            <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                <label for="tech-name" style="font-weight: 600; font-size: 0.9rem; color: var(--text-secondary);">Teknologi Navn</label>
                <input 
                    id="tech-name"
                    type="text" 
                    bind:value={newTechName} 
                    placeholder="f.eks. SvelteKit" 
                />
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label for="tech-color" style="font-weight: 600; font-size: 0.9rem; color: var(--text-secondary);">Farge</label>
                <div class="color-controls">
                    <input id="tech-color" type="color" bind:value={newTechColor} />
                    <input type="text" bind:value={newTechColor} placeholder="#000000" class="hex-input" />
                    <button 
                        class="btn secondary small" 
                        class:loading={isGenerating}
                        on:click={handleGenerateColor} 
                        disabled={isGenerating}
                    >
                        {#if isGenerating}
                            <span class="spinner"></span>
                            Genererer...
                        {:else}
                            ✨ Generer AI Farge
                        {/if}
                    </button>
                </div>
            </div>
        </div>
        <button class="btn primary" on:click={addTech} disabled={isGenerating} style="margin-top: 1rem;">
            + Legg til teknologi
        </button>
    </div>

    <div class="tech-grid">
        {#each technologies as tech}
            <div class="tech-card">
                <div class="color-preview" style="background: {tech.color}"></div>
                <div class="info">
                    <h3>{tech.name}</h3>
                    <div class="hex-display">
                        <span>{tech.color}</span>
                        <input 
                            type="color" 
                            value={tech.color} 
                            on:change={(e) => updateColor(tech.name, e.currentTarget.value)}
                            style="width: 30px; height: 30px; padding: 2px; border-radius: 6px;"
                        />
                    </div>
                </div>
                <button class="btn danger small" on:click={() => deleteTech(tech.name)}>Slett</button>
            </div>
        {/each}
    </div>
</div>

<style>
    .spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .btn.loading {
        cursor: wait;
        opacity: 0.7;
    }

    .tech-admin {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    h1 {
        font-size: clamp(2rem, 5vw, 2.5rem);
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .add-tech {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 4rem;
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 24px;
        box-shadow: var(--card-shadow);
        border: 1px solid var(--nav-bg);
    }

    .input-group {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1.5rem;
        align-items: flex-end;
    }

    .color-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .hex-input {
        width: 120px !important;
        font-family: 'JetBrains Mono', monospace !important;
    }

    input[type="text"], input[type="color"] {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.2s;
    }

    input[type="text"]:focus {
        border-color: var(--accent-primary);
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.1);
    }

    input[type="color"] {
        width: 50px;
        height: 44px;
        padding: 4px;
        cursor: pointer;
    }

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
    }

    .tech-card {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        box-shadow: var(--card-shadow);
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tech-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent-primary);
    }

    .color-preview {
        width: 100%;
        height: 100px;
        border-radius: 12px;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .info h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-primary);
    }

    .hex-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--bg-primary);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
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

    @media (max-width: 768px) {
        .input-group {
            grid-template-columns: 1fr;
        }

        .color-controls {
            flex-wrap: wrap;
        }

        .hex-input {
            flex: 1 !important;
        }

        .btn.secondary.small {
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.75rem;
        }

        .add-tech {
            padding: 1.5rem;
        }

        .tech-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
