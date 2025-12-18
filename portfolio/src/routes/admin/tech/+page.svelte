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
        <a href="/admin" class="btn secondary">Tilbake til Prosjekter</a>
    </header>

    <div class="add-tech">
        <div class="input-group">
            <input 
                type="text" 
                bind:value={newTechName} 
                placeholder="Navn på teknologi (f.eks. React)" 
            />
            <div class="color-controls">
                <input type="color" bind:value={newTechColor} />
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
                        Generer Farge
                    {/if}
                </button>
            </div>
        </div>
        <button class="btn primary" on:click={addTech} disabled={isGenerating}>
            Legg til teknologi
        </button>
    </div>

    <div class="tech-grid">
        {#each technologies as tech}
            <div class="tech-card">
                <div class="color-preview" style="background: {tech.color}"></div>
                <div class="info">
                    <h3>{tech.name}</h3>
                    <input 
                        type="color" 
                        value={tech.color} 
                        on:change={(e) => updateColor(tech.name, e.currentTarget.value)}
                    />
                    <span class="hex">{tech.color}</span>
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
        border: 2px solid rgba(var(--text-primary-rgb), 0.3);
        border-radius: 50%;
        border-top-color: var(--accent-primary);
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
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .add-tech {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 3rem;
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: var(--card-shadow);
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
    }

    .color-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .hex-input {
        width: 120px !important;
        font-family: monospace;
        flex: 0 !important;
    }

    input[type="text"] {
        flex: 1;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .tech-card {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        box-shadow: var(--card-shadow);
    }

    .color-preview {
        width: 100%;
        height: 80px;
        border-radius: 8px;
    }

    .info {
        text-align: center;
        width: 100%;
    }

    .hex {
        display: block;
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn.primary { background: var(--accent-primary); color: white; }
    .btn.secondary { background: var(--bg-primary); color: var(--text-primary); }
    .btn.danger.small { background: #fee2e2; color: #dc2626; font-size: 0.8rem; width: 100%; }
</style>
