<script lang="ts">
	import { language } from '$lib/stores/language';
	import { techColors } from '$lib/utils/techColors';

	export let project: {
		title: { no: string; en: string };
		description: { no: string; en: string };
		technologies: string[];
		image: string;
		link: string;
	};

	const fallbackImage = 'https://picsum.photos/seed/placeholder/800/400';
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.src = fallbackImage;
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		img.classList.add('loaded');
	}

	function getTechColor(tech: string): string {
		return tech in techColors ? techColors[tech as keyof typeof techColors] : '#666666';
	}
</script>

<div 
	class="project-card" 
	role="article"
	aria-label={project.title[$language]}
>
	<div class="project-image">
		<div class="image-skeleton"></div>
		<img 
			src={project.image} 
			alt={project.title[$language]} 
			loading="lazy"
			on:error={handleImageError}
			on:load={handleImageLoad}
		/>
	</div>
	<div class="project-content">
		<h3 tabindex="0">{project.title[$language]}</h3>
		<p tabindex="0">{project.description[$language]}</p>
		<div 
			class="tech-stack" 
			role="list" 
			aria-label={$language === 'no' ? 'Teknologier brukt' : 'Technologies used'}
		>
			{#each project.technologies as tech}
				<span 
					class="tech-tag" 
					style="--tech-color: {getTechColor(tech)}"
					role="listitem"
				>
					{tech}
				</span>
			{/each}
		</div>
		<a 
			href={project.link} 
			target="_blank" 
			rel="noopener noreferrer"
			class="project-link"
			aria-label={$language === 'no' ? `Les mer om ${project.title[$language]} (åpnes i ny fane)` : `Read more about ${project.title[$language]} (opens in new tab)`}
		>
			{$language === 'no' ? 'Les Mer' : 'Read More'} 
			<span aria-hidden="true">→</span>
		</a>
	</div>
</div>

<style>
	.project-card {
		background-color: var(--bg-secondary);
		border-radius: 20px;
		box-shadow: var(--card-shadow);
		overflow: hidden;
		border: 2px solid transparent;
		position: relative;
		z-index: 1;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-8px);
		border-color: var(--accent-primary);
	}

	.project-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		border-radius: 18px 18px 0 0;
		position: relative;
		background: var(--bg-secondary);
	}

	.image-skeleton {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--bg-secondary) 0%,
			var(--nav-bg) 50%,
			var(--bg-secondary) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease, opacity 0.3s ease;
		opacity: 0;
	}

	.project-image img.loaded {
		opacity: 1;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.project-content {
		padding: 1.5rem;
	}

	.project-content h3 {
		color: var(--text-primary);
		margin-bottom: 1rem;
		font-size: clamp(1.25rem, 4vw, 1.5rem);
	}

	.project-content p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-size: clamp(0.9rem, 3vw, 1rem);
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.tech-tag {
		background-color: var(--nav-bg);
		color: var(--nav-text);
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-size: clamp(0.75rem, 2vw, 0.875rem);
		transition: all 0.3s ease;
		border-left: 3px solid var(--tech-color);
	}

	.tech-tag:hover {
		background-color: var(--tech-color);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}

	.project-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--accent-primary);
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.project-link:hover {
		transform: translateX(5px);
	}
</style> 