<script>
	import { language, translations } from '$lib/stores/language';

	$: t = translations[$language];

	let formData = {
		name: '',
		email: '',
		message: ''
	};

	function handleSubmit(event) {
		event.preventDefault();
		console.log('Skjema sendt:', formData);
		formData = {
			name: '',
			email: '',
			message: ''
		};
	}
</script>

<div class="contact-container">
	<h1>{t.contact.title}</h1>
	<p class="contact-intro">{t.contact.intro}</p>

	<div class="contact-content">
		<div class="contact-info">
			<h2>{t.contact.title}</h2>
			<div class="info-item">
				<span class="label">{t.contact.name}:</span>
				<span>Daniel Johan Sørby</span>
			</div>
			<div class="info-item">
				<span class="label">{t.contact.email}:</span>
				<a href="mailto:kontakt@danieljsorby.no">kontakt@danieljsorby.no</a>
			</div>
			<div class="info-item">
				<span class="label">{t.contact.location}:</span>
				<span>Oslo, Norge</span>
			</div>
			<div class="social-links">
				<a href="https://github.com/danieljsorby" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">Twitter</a>
			</div>
		</div>

		<form class="contact-form" on:submit={handleSubmit}>
			<div class="form-group">
				<label for="name">{t.contact.name}</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
				/>
			</div>

			<div class="form-group">
				<label for="email">{t.contact.email}</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					required
				/>
			</div>

			<div class="form-group">
				<label for="message">{t.contact.message}</label>
				<textarea
					id="message"
					bind:value={formData.message}
					rows="5"
					required
				></textarea>
			</div>

			<button type="submit">{t.contact.send}</button>
		</form>
	</div>
</div>

<style>
	.contact-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 2rem);
	}

	.contact-header {
		text-align: center;
		margin-bottom: clamp(2rem, 5vw, 4rem);
	}

	.contact-header h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		color: var(--text-primary);
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
	}

	.contact-header p {
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto;
		font-size: clamp(1rem, 3vw, 1.2rem);
	}

	.contact-content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: start;
	}

	.contact-info {
		background-color: var(--bg-secondary);
		padding: clamp(1.5rem, 4vw, 2rem);
		border-radius: 12px;
		box-shadow: var(--card-shadow);
	}

	.contact-info h2 {
		color: var(--text-primary);
		font-size: clamp(1.5rem, 4vw, 2rem);
		margin-bottom: clamp(1.5rem, 4vw, 2rem);
	}

	.info-item {
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
	}

	.info-item .label {
		color: var(--text-secondary);
		display: block;
		margin-bottom: 0.5rem;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
	}

	.info-item span,
	.info-item a {
		color: var(--text-primary);
		font-size: clamp(1rem, 3vw, 1.2rem);
	}

	.social-links {
		margin-top: clamp(1.5rem, 4vw, 2rem);
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.social-links a {
		color: var(--accent-primary);
		text-decoration: none;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.3s ease;
	}

	.social-links a:hover {
		color: var(--accent-secondary);
		transform: translateY(-2px);
	}

	.contact-form {
		background-color: var(--bg-secondary);
		padding: clamp(1.5rem, 4vw, 2rem);
		border-radius: 12px;
		box-shadow: var(--card-shadow);
		border-left: 4px solid var(--accent-primary);
	}

	.form-group {
		margin-bottom: clamp(1.5rem, 4vw, 2rem);
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-primary);
		font-size: clamp(0.9rem, 2.5vw, 1rem);
	}

	input,
	textarea {
		width: 100%;
		padding: clamp(0.75rem, 2vw, 1rem);
		border-radius: 8px;
		border: 2px solid var(--text-secondary);
		background-color: var(--bg-primary);
		color: var(--text-primary);
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		transition: all 0.3s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.1);
	}

	textarea {
		min-height: 150px;
		resize: vertical;
	}

	button {
		background-color: var(--accent-primary);
		color: white;
		padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
		border: none;
		border-radius: 8px;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		width: 100%;
	}

	button:hover {
		background-color: var(--accent-secondary);
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.2);
	}

	@media (max-width: 768px) {
		.contact-content {
			grid-template-columns: 1fr;
			gap: clamp(1.5rem, 4vw, 2rem);
		}

		.contact-info {
			order: 2;
		}

		.contact-form {
			order: 1;
		}

		.social-links {
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.contact-header {
			margin-bottom: clamp(1.5rem, 4vw, 2rem);
		}

		.info-item {
			text-align: center;
		}

		.social-links {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
		}

		button {
			padding: clamp(0.75rem, 2vw, 1rem);
		}
	}
</style> 