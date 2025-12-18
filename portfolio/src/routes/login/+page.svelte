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
        min-height: 80vh;
        padding: 2rem;
    }

    .login-form {
        background: var(--bg-secondary);
        padding: 3rem;
        border-radius: 30px;
        box-shadow: var(--card-shadow);
        width: 100%;
        max-width: 450px;
        border: 1px solid var(--nav-bg);
        backdrop-filter: blur(10px);
    }

    h1 {
        text-align: center;
        margin-bottom: 2.5rem;
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .form-group {
        margin-bottom: 2rem;
    }

    label {
        display: block;
        margin-bottom: 0.75rem;
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.9rem;
    }

    input {
        width: 100%;
        padding: 1rem 1.25rem;
        border-radius: 15px;
        border: 1px solid var(--nav-bg);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    input:focus {
        border-color: var(--accent-primary);
        outline: none;
        box-shadow: 0 0 0 4px rgba(var(--accent-primary-rgb), 0.1);
        transform: translateY(-2px);
    }

    button {
        width: 100%;
        padding: 1rem;
        border-radius: 50px;
        border: none;
        background: var(--accent-primary);
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
        box-shadow: 0 4px 15px rgba(var(--accent-primary-rgb), 0.3);
    }

    button:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(var(--accent-primary-rgb), 0.4);
    }

    button:active:not(:disabled) {
        transform: translateY(-1px);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .error-message {
        background: rgba(220, 38, 38, 0.1);
        color: #dc2626;
        padding: 1rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        text-align: center;
        font-size: 0.9rem;
        border: 1px solid rgba(220, 38, 38, 0.2);
    }
</style>

