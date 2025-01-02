<script>
	import { language, translations } from '$lib/stores/language';

	$: t = translations[$language];
</script>

<div class="about-container">
	<div class="about-header">
		<h1>{t.about.title}</h1>
		<div class="profile-section">
			<img src="https://media.licdn.com/dms/image/v2/D4E03AQGc_J0tcetJPQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1714327384635?e=2147483647&v=beta&t=EU5RNVdbn8Txfu31fSQCrqeJImidBs7-WntxBbKjack" alt="Daniel Johan Sørby" class="profile-image" />
			<div class="intro">
				<h2>Daniel Johan Sørby</h2>
				<p class="title">{t.hero.subtitle}</p>
			</div>
		</div>
	</div>

	<section class="about-content">
		<h3>{t.about.background}</h3>
		<p>
			{$language === 'no' 
				? 'Jeg er en engasjert full-stack utvikler med lidenskap for å skape innovative og brukervennlige løsninger. Min reise innen programmering startet med en sterk interesse for teknologi og et ønske om å bygge ting som gjør en forskjell.'
				: 'I am a passionate full-stack developer dedicated to creating innovative and user-friendly solutions. My journey in programming began with a strong interest in technology and a desire to build things that make a difference.'}
		</p>

		<h3>{t.about.experience}</h3>
		<div class="experience-item">
			<h4>{$language === 'no' ? 'Freelance Utvikler' : 'Freelance Developer'}</h4>
			<p class="date">2023 - {$language === 'no' ? 'Nåværende' : 'Present'}</p>
			<p>
				{$language === 'no'
					? 'Jobber med diverse prosjekter for klienter, med fokus på webutvikling og design. Bruker moderne teknologier som React, Svelte, og Node.js.'
					: 'Working on various projects for clients, focusing on web development and design. Using modern technologies like React, Svelte, and Node.js.'}
			</p>
		</div>

		<h3>{t.about.education}</h3>
		<div class="education-item">
			<h4>{$language === 'no' 
				? 'Informasjonsteknologi og Medieproduksjon med spesialisering i Informasjonsteknologi'
				: 'Information Technology and Media Production with specialization in Information Technology'}</h4>
			<p class="date">2023 - 2026</p>
			<p>Elevbakken VGS</p>
		</div>
	</section>
</div>

<style>
	.about-container {
		max-width: 800px;
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 2rem);
	}

	.about-header {
		text-align: center;
		margin-bottom: clamp(2rem, 5vw, 3rem);
	}

	.about-header h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		color: var(--text-primary);
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
	}

	.profile-section {
		margin: clamp(1.5rem, 4vw, 2rem) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(1rem, 3vw, 1.5rem);
	}

	.profile-image {
		width: clamp(150px, 30vw, 200px);
		height: clamp(150px, 30vw, 200px);
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid var(--accent-primary);
		box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.2);
		transition: transform 0.3s ease;
	}

	.profile-image:hover {
		transform: scale(1.05);
	}

	.intro {
		text-align: center;
	}

	.intro h2 {
		font-size: clamp(1.5rem, 4vw, 2rem);
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.title {
		color: var(--text-secondary);
		font-size: clamp(1rem, 3vw, 1.1rem);
	}

	.about-content {
		line-height: 1.8;
		color: var(--text-secondary);
		font-size: clamp(0.9rem, 2.5vw, 1rem);
	}

	h3 {
		margin-top: clamp(2rem, 5vw, 3rem);
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
		color: var(--text-primary);
		font-size: clamp(1.25rem, 4vw, 1.5rem);
	}

	.experience-item,
	.education-item {
		background-color: var(--bg-secondary);
		padding: clamp(1.25rem, 3vw, 1.5rem);
		border-radius: 12px;
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
		box-shadow: var(--card-shadow);
		border-left: 4px solid var(--accent-primary);
		transition: transform 0.3s ease;
	}

	.experience-item:hover,
	.education-item:hover {
		transform: translateY(-4px);
	}

	.experience-item h4,
	.education-item h4 {
		color: var(--text-primary);
		font-size: clamp(1.1rem, 3.5vw, 1.25rem);
		margin-bottom: 0.5rem;
	}

	.date {
		color: var(--accent-primary);
		font-size: clamp(0.8rem, 2vw, 0.9rem);
		margin: 0.25rem 0 0.75rem;
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background-color: rgba(var(--accent-primary-rgb), 0.1);
		border-radius: 16px;
	}

	@media (max-width: 768px) {
		.about-container {
			padding: clamp(1rem, 3vw, 1.5rem);
		}

		.profile-section {
			margin: clamp(1rem, 3vw, 1.5rem) 0;
		}
	}

	@media (max-width: 480px) {
		.experience-item,
		.education-item {
			padding: 1rem;
		}

		.experience-item:hover,
		.education-item:hover {
			transform: none;
		}
	}
</style> 