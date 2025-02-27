<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let isMac = false;
    let showDownload = false;

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        console.log(isMac ? 'Du er på Mac' : 'Du er på Windows');
    });

    async function copyText(text = "Halla Balla") {
        try {
            await navigator.clipboard.writeText(text);
            console.log(`${text} kopiert til utklippstavlen`);
        } catch (err) {
            console.error('Feil ved kopiering til utklippstavlen:', err);
        }
    }
    let downloadUrl = "/"
    async function downloadFile() {
        if (isMac) {
            copyText("cd downloads && chmod +x curlyparrot.sh && ./curlyparrot.sh");
            downloadUrl = '/curlyparrot.sh'
        } else {
            copyText("cd downloads && curlyparrot.bat");
            downloadUrl = '/curlyparrot.bat'
        }
        showDownload = true;
        setTimeout(() => {
            showDownload = false;
        }, 5000);
    }
</script>

<button class="cta-button secondary" on:click={downloadFile}>Gjør Klar</button>

{#if showDownload}
    <a href="{downloadUrl}" download>Last Ned</a>
{/if}

<style>
    .cta-button {
        padding: 1rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .cta-button.secondary {
        background: transparent;
        color: var(--text-primary);
        border: 2px solid var(--accent-primary);
    }
</style>