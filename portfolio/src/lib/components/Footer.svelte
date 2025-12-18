<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import { language, translations } from '$lib/stores/language';
	import { page } from '$app/stores';

	$: t = translations[$language];
	$: settings = $page.data.settings;
</script>

<footer>
	<div class="wave-container">
		<svg class="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
			<path d="M0,224L48,229.3C96,235,192,245,288,234.7C384,224,480,192,576,192C672,192,768,224,864,224C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
		</svg>
	</div>
	<div class="footer-content">
		<div class="footer-grid">
			<div class="footer-section">
				<h3>Daniel Johan Sørby</h3>
				<p class="footer-description">{t.footer.description}</p>
			</div>
			<div class="footer-section">
				<h4>{t.footer.contact}</h4>
				<ul class="footer-links">
					<li>
						<a href="mailto:{settings?.contact_email || 'kontakt@danielsorby.no'}">
							<span class="icon">✉</span> {t.footer.email}
						</a>
					</li>
					{#if settings?.github_url}
						<li>
							<a href={settings.github_url} target="_blank" rel="noopener noreferrer">
								<span class="icon">⌨</span> GitHub
							</a>
						</li>
					{/if}
					{#if settings?.linkedin_url}
						<li>
							<a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer">
								<span class="icon">💼</span> LinkedIn
							</a>
						</li>
					{/if}
				</ul>
			</div>
			<div class="footer-section">
				<h4>{t.footer.navigation}</h4>
				<ul class="footer-links">
					<li><a href="/">{t.nav.home}</a></li>
					<li><a href="/projects">{t.nav.projects}</a></li>
					<li><a href="/about">{t.nav.about}</a></li>
					<li><a href="/contact">{t.nav.contact}</a></li>
				</ul>
			</div>
		</div>
		<div class="footer-bottom">
			<p>© {new Date().getFullYear()} Daniel Johan Sørby. {t.footer.rights}</p>
			<div class="theme-lang-toggle">
				<ThemeToggle />
				<LanguageToggle />
			</div>
		</div>
	</div>
</footer>

<style>
	.wave-container {
		position: relative;
		width: 100%;
		transform: translateY(1px);
	}

	.wave {
		display: block;
		width: 100%;
		height: auto;
	}

	.wave path {
		fill: var(--nav-bg);
	}

	.footer-content {
		background: var(--nav-bg);
		color: var(--nav-text);
		padding: 4rem 2rem 2rem;
		text-align: center;
	}

	.footer-grid {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 3rem;
		text-align: left;
		margin-bottom: 3rem;
	}

	.footer-section h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--nav-text);
	}

	.footer-section h4 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
		color: var(--nav-text);
	}

	.footer-description {
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.footer-links {
		list-style: none;
		padding: 0;
	}

	.footer-links li {
		margin-bottom: 0.5rem;
	}

	.footer-links a {
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.footer-links a:hover {
		color: var(--accent-primary);
	}

	.icon {
		font-size: 1.2rem;
	}

	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
	}

	.theme-lang-toggle {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 1rem;
		}

		.theme-lang-toggle {
			margin-top: 1rem;
		}
	}
</style> 