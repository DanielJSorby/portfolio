<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;
    let settings = { ...(data.settings || {}) };
    let loading = false;
    let message = '';

    async function saveSettings() {
        loading = true;
        message = 'Lagrer...';
        
        const { error } = await supabase
            .from('site_settings')
            .upsert({ ...settings, id: 1 });

        if (error) {
            alert('Feil ved lagring: ' + error.message);
            message = 'Feil ved lagring';
        } else {
            message = 'Innstillinger lagret!';
            await invalidateAll();
            setTimeout(() => message = '', 3000);
        }
        loading = false;
    }
</script>

<div class="admin-container">
    <header>
        <div class="header-content">
            <a href="/admin" class="back-link">← Tilbake til Dashboard</a>
            <h1>Sideinnstillinger</h1>
        </div>
        <button class="btn primary" on:click={saveSettings} disabled={loading}>
            {loading ? 'Lagrer...' : 'Lagre endringer'}
        </button>
    </header>

    {#if message}
        <div class="status-message" class:success={message.includes('lagret')}>
            {message}
        </div>
    {/if}

    <div class="settings-grid">
        <section class="card">
            <h2>Generell Info & SEO</h2>
            <div class="form-group">
                <label for="full-name">Fullt Navn</label>
                <input type="text" id="full-name" bind:value={settings.full_name} />
            </div>
            <div class="form-group">
                <label for="github-user">GitHub Brukernavn</label>
                <input type="text" id="github-user" bind:value={settings.github_username} />
            </div>
            <div class="form-group">
                <label for="seo-no">SEO Beskrivelse (Norsk)</label>
                <textarea id="seo-no" bind:value={settings.seo_description_no} rows="2"></textarea>
            </div>
            <div class="form-group">
                <label for="seo-en">SEO Description (English)</label>
                <textarea id="seo-en" bind:value={settings.seo_description_en} rows="2"></textarea>
            </div>
        </section>

        <section class="card">
            <h2>Om meg (Bio)</h2>
            <div class="form-group">
                <label for="bio-no">Biografi (Norsk)</label>
                <textarea id="bio-no" bind:value={settings.bio_no} rows="6"></textarea>
            </div>
            <div class="form-group">
                <label for="bio-en">Biography (English)</label>
                <textarea id="bio-en" bind:value={settings.bio_en} rows="6"></textarea>
            </div>
        </section>

        <section class="card">
            <h2>Hero & Profil</h2>
            <div class="form-group">
                <label for="hero-title-no">Hero Tittel (Norsk)</label>
                <input type="text" id="hero-title-no" bind:value={settings.hero_title_no} />
            </div>
            <div class="form-group">
                <label for="hero-title-en">Hero Title (English)</label>
                <input type="text" id="hero-title-en" bind:value={settings.hero_title_en} />
            </div>
            <div class="form-group">
                <label for="hero-no">Hero Undertittel (Norsk)</label>
                <input type="text" id="hero-no" bind:value={settings.hero_subtitle_no} />
            </div>
            <div class="form-group">
                <label for="hero-en">Hero Subtitle (English)</label>
                <input type="text" id="hero-en" bind:value={settings.hero_subtitle_en} />
            </div>
            <div class="form-group">
                <label for="profile-img">Profilbilde URL</label>
                <input type="text" id="profile-img" bind:value={settings.profile_image_url} />
            </div>
        </section>

        <section class="card">
            <h2>Footer</h2>
            <div class="form-group">
                <label for="footer-no">Footer Beskrivelse (Norsk)</label>
                <textarea id="footer-no" bind:value={settings.footer_description_no} rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="footer-en">Footer Description (English)</label>
                <textarea id="footer-en" bind:value={settings.footer_description_en} rows="3"></textarea>
            </div>
        </section>

        <section class="card">
            <h2>Kontakt & Sosiale Medier</h2>
            <div class="form-group">
                <label for="email">E-post</label>
                <input type="email" id="email" bind:value={settings.contact_email} />
            </div>
            <div class="form-group">
                <label for="loc-text">Lokasjon Tekst</label>
                <input type="text" id="loc-text" bind:value={settings.location_text} />
            </div>
            <div class="form-group">
                <label for="loc-url">Google Maps URL</label>
                <input type="text" id="loc-url" bind:value={settings.location_url} />
            </div>
            <div class="form-group">
                <label for="github">GitHub URL</label>
                <input type="text" id="github" bind:value={settings.github_url} />
            </div>
            <div class="form-group">
                <label for="linkedin">LinkedIn URL</label>
                <input type="text" id="linkedin" bind:value={settings.linkedin_url} />
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

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2rem;
        gap: 1.5rem;
        flex-wrap: wrap;
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

    h1 {
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .card {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid var(--nav-bg);
        box-shadow: var(--card-shadow);
    }

    h2 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
        color: var(--accent-primary);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    label {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    input, textarea {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn.primary {
        background: var(--accent-primary);
        color: white;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .status-message {
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        background: rgba(220, 38, 38, 0.1);
        color: #dc2626;
        text-align: center;
    }

    .status-message.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }

    @media (max-width: 600px) {
        .admin-container { padding: 1rem; }
        header { flex-direction: column; align-items: stretch; }
        .btn { width: 100%; }
    }
</style>

