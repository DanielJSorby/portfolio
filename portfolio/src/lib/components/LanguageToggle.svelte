<script>
    import { language } from '$lib/stores/language';
    
    function toggleLanguage() {
        language.update(current => current === 'no' ? 'en' : 'no');
    }
</script>

<button class="lang-toggle" on:click={toggleLanguage}>
    {$language === 'no' ? 'EN' : 'NO'}
</button>

<style>
    .lang-toggle {
        background: none;
        border: 2px solid var(--nav-text);
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        color: var(--nav-text);
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
    }

    .lang-toggle:hover {
        background-color: var(--nav-text);
        color: var(--nav-bg);
    }
</style> 