<script lang="ts">
    import ProjectForm from '$lib/components/ProjectForm.svelte';
</script>

<div class="admin-page">
    <h1>Legg til nytt prosjekt</h1>
    <ProjectForm />
</div>

<style>
    .admin-page {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
    }
    h1 { margin-bottom: 2rem; }
</style>

