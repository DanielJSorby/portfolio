<script lang="ts">
	import { onMount } from 'svelte';
	import { language } from '$lib/stores/language';

	const username = 'DanielJSorby';
	
	interface GitHubStats {
		repositories: number;
		stars: number;
		followers: number;
		following: number;
	}

	interface GitHubRepo {
		name: string;
		description: string | null;
		stars: number;
		forks: number;
		language: string | null;
		url: string;
		updated_at: string;
	}

	let stats: GitHubStats | null = null;
	let topRepos: GitHubRepo[] = [];
	let loading = true;
	let error = false;

	async function fetchGitHubData() {
		try {
			const [userResponse, reposResponse] = await Promise.all([
				fetch(`https://api.github.com/users/${username}`),
				fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
			]);

			const userData = await userResponse.json();
			const reposData = await reposResponse.json();

			stats = {
				repositories: userData.public_repos,
				stars: reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0),
				followers: userData.followers,
				following: userData.following
			};

			topRepos = reposData.map((repo: any) => ({
				name: repo.name,
				description: repo.description,
				stars: repo.stargazers_count,
				forks: repo.forks_count,
				language: repo.language,
				url: repo.html_url,
				updated_at: new Date(repo.updated_at).toLocaleDateString(
					$language === 'no' ? 'nb-NO' : 'en-US', 
					{ year: 'numeric', month: 'short', day: 'numeric' }
				)
			}));
		} catch (e) {
			error = true;
		} finally {
			loading = false;
		}
	}

	onMount(fetchGitHubData);
</script>

<section class="github-section">
	<h2 class="github-title">
		<svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true" class="github-icon">
			<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
		</svg>
		<span>{$language === 'no' ? 'GitHub Aktivitet' : 'GitHub Activity'}</span>
	</h2>
	<div class="github-header">
		<div class="profile-info">
			<a 
				href="https://github.com/{username}" 
				target="_blank" 
				rel="noopener noreferrer"
				class="profile-link"
				aria-label={$language === 'no' ? 'Besøk GitHub profil' : 'Visit GitHub profile'}
			>
				<img 
					src="https://github.com/{username}.png" 
					alt={username}
					class="profile-image"
					loading="lazy"
				/>
				<div class="profile-details">
					<h3>{username}</h3>
					<div class="stats-row">
						{#if stats}
							<span class="stat-link">
								<span class="stat-icon">👥</span>
								<span class="stat-value">{stats.followers}</span>
								<span class="stat-label">{$language === 'no' ? 'følgere' : 'followers'}</span>
							</span>
							<span class="stat-dot">·</span>
							<span class="stat-link">
								<span class="stat-value">{stats.following}</span>
								<span class="stat-label">{$language === 'no' ? 'følger' : 'following'}</span>
							</span>
						{/if}
					</div>
				</div>
			</a>
		</div>
	</div>

	{#if loading}
		<div class="loading-skeleton">
			<div class="repos-skeleton" />
			<div class="repos-skeleton" />
			<div class="repos-skeleton" />
		</div>
	{:else if error}
		<div class="error-message">
			{$language === 'no' 
				? 'Kunne ikke laste GitHub-data. Prøv igjen senere.' 
				: 'Could not load GitHub data. Please try again later.'}
		</div>
	{:else}
		<div class="contribution-section">
			<h3>
				{$language === 'no' ? 'Populære Repositories' : 'Popular Repositories'}
				<span class="repo-count">({stats?.repositories})</span>
			</h3>
			<div class="repos-grid">
				{#each topRepos as repo}
					<a 
						href={repo.url} 
						class="repo-card" 
						target="_blank" 
						rel="noopener noreferrer"
					>
						<div class="repo-header">
							<h4>{repo.name}</h4>
							<span class="repo-visibility">Public</span>
						</div>
						{#if repo.description}
							<p>{repo.description}</p>
						{/if}
						<div class="repo-meta">
							{#if repo.language}
								<span class="language-tag">
									{repo.language}
								</span>
							{/if}
							{#if repo.stars > 0}
								<span class="meta-stat">
									<svg aria-label="star" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="meta-icon">
										<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
									</svg>
									{repo.stars}
								</span>
							{/if}
							{#if repo.forks > 0}
								<span class="meta-stat">
									<svg aria-label="fork" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="meta-icon">
										<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
									</svg>
									{repo.forks}
								</span>
							{/if}
							<span class="update-info">Updated {repo.updated_at}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	.github-section {
		max-width: 1012px;
		margin: 0 auto;
		padding: 2rem;
	}

	.github-header {
		margin-bottom: 2rem;
	}

	.profile-info {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.profile-image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 2px solid var(--accent-primary);
	}

	.stats-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
	}

	.stat-link {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.stat-link:hover {
		color: var(--accent-primary);
	}

	.stat-icon {
		font-size: 1.1rem;
	}

	.stat-dot {
		color: var(--text-secondary);
	}

	.contribution-section {
		margin-top: 2rem;
	}

	h3 {
		font-size: 1.25rem;
		color: var(--text-primary);
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.repo-count {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.repos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	.repo-card {
		background: var(--bg-secondary);
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid var(--nav-bg);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.repo-card:hover {
		border-color: var(--accent-primary);
		transform: translateY(-2px);
	}

	.repo-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.repo-header h4 {
		color: var(--accent-primary);
		font-size: 1rem;
		font-weight: 600;
	}

	.repo-visibility {
		font-size: 0.75rem;
		color: var(--text-secondary);
		border: 1px solid var(--nav-bg);
		padding: 0.125rem 0.5rem;
		border-radius: 12px;
	}

	.repo-card p {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 1rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.repo-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.language-tag {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-icon {
		fill: currentColor;
	}

	.update-info {
		margin-left: auto;
		font-size: 0.8rem;
	}

	.loading-skeleton {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	.repos-skeleton {
		height: 150px;
		background: var(--bg-secondary);
		border-radius: 6px;
		animation: pulse 1.5s infinite;
	}

	.error-message {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem;
		background: var(--bg-secondary);
		border-radius: 6px;
		border: 1px solid var(--accent-primary);
	}

	@keyframes pulse {
		0% { opacity: 0.6; }
		50% { opacity: 0.3; }
		100% { opacity: 0.6; }
	}

	@media (max-width: 768px) {
		.github-section {
			padding: 1rem;
		}

		.profile-image {
			width: 60px;
			height: 60px;
		}

		.repos-grid {
			grid-template-columns: 1fr;
		}
	}

	.github-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
		font-size: clamp(1.8rem, 5vw, 2.5rem);
		color: var(--text-primary);
	}

	.github-icon {
		fill: var(--text-primary);
	}

	.profile-link {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.profile-link:hover {
		transform: translateY(-2px);
	}

	.profile-details h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--accent-primary);
	}
</style>
