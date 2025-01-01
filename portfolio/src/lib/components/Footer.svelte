<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import { language, translations } from '$lib/stores/language';

	$: t = translations[$language];
</script>

<footer>
	<div class="wave-container">
		<svg class="wave" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
			<path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,90.7C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
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
						<a href="mailto:kontakt@danielsorby.no">
							<span class="icon">✉</span> {t.footer.email}
						</a>
					</li>
					<li>
						<a href="https://github.com/danieljsorby" target="_blank" rel="noopener noreferrer">
							<span class="icon">⌨</span> GitHub
						</a>
					</li>
					<li>
						<a href="https://www.linkedin.com/in/daniel-johan-s%C3%B8rby-4a3aab2ab/" target="_blank" rel="noopener noreferrer">
							<span class="icon">💼</span> LinkedIn
						</a>
					</li>
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