<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { language, translations } from '$lib/stores/language';

    let email = '';
    let password = '';
    let loading = false;
    let error: string | null = null;

    $: t = translations[$language];

    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            goto('/admin');
        }
    });

    async function handleLogin() {
        loading = true;
        error = null;
        
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (loginError) {
            error = loginError.message;
            loading = false;
        } else {
            // Force a hard redirect to ensure auth state is picked up
            window.location.href = '/admin';
        }
    }
</script>

<div class="login-container">
    <form on:submit|preventDefault={handleLogin} class="login-form">
        <h1>Admin Login</h1>
        
        {#if error}
            <div class="error-message">{error}</div>
        {/if}

        <div class="form-group">
            <label for="email">Email</label>
            <input 
                type="email" 
                id="email" 
                bind:value={email} 
                required 
                placeholder="admin@example.com"
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input 
                type="password" 
                id="password" 
                bind:value={password} 
                required 
            />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
        </button>
    </form>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 2rem;
    }

    .login-form {
        background: var(--bg-secondary);
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: var(--card-shadow);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--text-primary);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }

    input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        border-radius: 10px;
        border: none;
        background: var(--accent-primary);
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        margin-top: 1rem;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 10px;
        margin-bottom: 1.5rem;
        text-align: center;
        font-size: 0.9rem;
    }
</style>

