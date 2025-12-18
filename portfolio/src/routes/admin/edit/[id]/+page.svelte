<script lang="ts">
    import ProjectForm from '$lib/components/ProjectForm.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="admin-page">
    <h1>Rediger prosjekt</h1>
    <ProjectForm project={data.project} />
</div>

<style>
    .admin-page {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
    }
    h1 { margin-bottom: 2rem; }
</style>

