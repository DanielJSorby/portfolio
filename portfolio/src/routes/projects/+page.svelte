<script>
	import { language, translations } from '$lib/stores/language';
	import { techColors } from '$lib/utils/techColors';
	
	$: t = translations[$language];

	const projects = [
		{
			title: {
				no: 'Dasi GPT',
				en: 'Dasi GPT'
			},
			description: {
				no: 'En ai chatbot som hjelper deg med alt du trenger!',
				en: 'An ai chatbot that helps you with everything you need!'
			},
			technologies: ['Svelte Kit', 'TypeScript', 'OpenAI', 'MySQL', 'Linux'],
			image: 'https://picsum.photos/800/400?random=1',
			link: 'https://github.com/DanielJSorby/DASI'
		},
		{
			title: {
				no: 'Prime Wheels',
				en: 'Prime Wheels'
			},
			description: {
				no: 'Et bilnettsted for å kjøpe biler. Laget som en skoleprosjekt.',
				en: 'A car website for buying cars. Made as a school project.'
			},
			technologies: ['HTML', 'CSS', 'JavaScript'],
			image: 'https://picsum.photos/800/400?random=2',
			link: 'https://github.com/DanielJSorby/DanielOgSimen'
		},
		{
			title: {
				no: 'IMDB',
				en: 'IMDB'
			},
			description: {
				no: 'En nettside hvor du kan se informasjon om filmer.',
				en: 'A website where you can see information about movies.'
			},
			technologies: ['HTML', 'CSS', 'JavaScript'],
			image: 'https://picsum.photos/800/400?random=3',
			link: 'https://github.com/DanielJSorby/imdb'
		},
		{
			title: {
				no: 'Flow',
				en: 'Flow'
			},
			description: {
				no: 'Nettsiden til energidrikken flow. Laget som et bedriftprosjekt på skolen',
				en: 'The website for the energy drink flow. Created as a business project at school'
			},
			technologies: ['Svelte Kit', 'Json', 'JavaScript'],
			image: 'https://picsum.photos/800/400?random=4',
			link: 'https://github.com/DanielJSorby/flow-svelte'
		},
		{
			title: {
				no: 'Flask Logg Inn',
				en: 'Flask Log In'
			},
			description: {
				no: 'Et prosjekt for å lære Flask, med et enkelt innloggingsskjema som sjekker mot en bruker-JSON-fil.',
				en: 'A project to learn Flask, featuring a simple login form that validates against a user JSON file.'
			},
			technologies: ['Python', 'Json', 'JavaScript', 'HTML'],
			image: 'https://picsum.photos/800/400?random=5',
			link: 'https://github.com/DanielJSorby/flask'
		}
	];
</script>

<div class="projects-header">
	<h1>{t.projects.title}</h1>
	<p>{t.projects.description}</p>
</div>

<div class="projects-container">
	{#each projects as project}
		<div class="project-card">
			<div class="project-image">
				<img src={project.image} alt={project.title[$language]} />
			</div>
			<div class="project-content">
				<h2>{project.title[$language]}</h2>
				<p>{project.description[$language]}</p>
				<div class="tech-stack">
					{#each project.technologies as tech}
						<span class="tech-tag" style="--tech-color: {techColors[tech] || '#666666'}">
							{tech}
						</span>
					{/each}
				</div>
				<a href={project.link} target="_blank" rel="noopener noreferrer">
					{t.projects.viewProject} →
				</a>
			</div>
		</div>
	{/each}
</div>

<style>
	.projects-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 0 1rem;
	}

	.projects-header h1 {
		color: var(--text-primary);
		font-size: clamp(2rem, 5vw, 3rem);
	}

	.projects-header p {
		color: var(--text-secondary);
		max-width: 600px;
		margin: 1rem auto;
		font-size: clamp(1rem, 3vw, 1.2rem);
	}

	.projects-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		padding: 0 1rem;
	}

	.project-card {
		background-color: var(--bg-secondary);
		border-radius: 20px;
		box-shadow: var(--card-shadow);
		overflow: hidden;
		transition: all 0.3s ease;
		border: 2px solid transparent;
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.project-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			45deg,
			var(--accent-primary),
			var(--accent-secondary)
		);
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-8px) rotate(1deg);
		border-color: var(--accent-primary);
	}

	.project-card:hover::before {
		opacity: 0.1;
	}

	.project-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		border-radius: 18px 18px 0 0;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.project-content {
		padding: 1.5rem;
	}

	.project-content h2 {
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

	a {
		display: inline-block;
		margin-top: 1rem;
		text-decoration: none;
		color: var(--accent-primary);
		font-weight: 500;
		transition: color 0.2s;
	}

	a:hover {
		color: var(--accent-secondary);
	}

	@media (max-width: 768px) {
		.project-card:hover {
			transform: translateY(-4px) rotate(0deg);
		}

		.project-image {
			height: 180px;
		}

		.project-content {
			padding: 1.25rem;
		}

		.tech-stack {
			gap: 0.35rem;
		}
	}

	@media (max-width: 480px) {
		.projects-container {
			gap: 1.5rem;
		}

		.project-image {
			height: 160px;
		}
	}
</style> 