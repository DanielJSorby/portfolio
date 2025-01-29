<script lang="ts">
	import { language, translations } from '$lib/stores/language';

	$: t = translations[$language];

	let formData = {
		name: '',
		email: '',
		message: ''
	};

	let isSubmitting = false;
	let submitStatus = '';

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		submitStatus = '';

		try {
			const response = await fetch('https://formspree.io/f/meoopjjv', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				submitStatus = $language === 'no' ? 'Melding sendt!' : 'Message sent!';
				formData = {
					name: '',
					email: '',
					message: ''
				};
			} else {
				submitStatus = $language === 'no' ? 'Noe gikk galt. Prøv igjen.' : 'Something went wrong. Please try again.';
			}
		} catch (error) {
			submitStatus = $language === 'no' ? 'Kunne ikke sende melding. Sjekk internettforbindelsen.' : 'Could not send message. Check your internet connection.';
		}

		isSubmitting = false;
	}
</script>

<div class="contact-container">
	<div class="contact-header">
		<h1>{t.contact.title}</h1>
		<p>{t.contact.description}</p>
	</div>

	<div class="contact-content">
		<div class="contact-info">
			<h2>{t.contact.getInTouch}</h2>
			<div class="info-item">
				<span class="label">{t.contact.location}</span>
				<a 
					href="https://www.google.com/maps/place/Oslo" 
					target="_blank" 
					rel="noopener noreferrer"
					class="location-link"
				>
					Oslo, Norge
				</a>
			</div>
			<div class="info-item">
				<span class="label">{t.contact.email}</span>
				<a href="mailto:kontakt@danielsorby.no">kontakt@danielsorby.no</a>
			</div>
			<div class="social-links">
				<a href="https://github.com/DanielJSorby" target="_blank" rel="noopener noreferrer">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
					</svg>
					GitHub
				</a>
				<a href="www.linkedin.com/in/danieljsorby" target="_blank" rel="noopener noreferrer">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
						<rect x="2" y="9" width="4" height="12"></rect>
						<circle cx="4" cy="4" r="2"></circle>
					</svg>
					LinkedIn
				</a>
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
					placeholder={$language === 'no' ? 'Skriv navnet ditt her' : 'Enter your name here'}
					disabled={isSubmitting}
				/>
			</div>

			<div class="form-group">
				<label for="email">{t.contact.email}</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					required
					placeholder={$language === 'no' ? 'Din e-postadresse' : 'Your email address'}
					disabled={isSubmitting}
				/>
			</div>

			<div class="form-group">
				<label for="message">{t.contact.message}</label>
				<textarea
					id="message"
					bind:value={formData.message}
					rows="5"
					required
					placeholder={$language === 'no' ? 'Skriv meldingen din her' : 'Write your message here'}
					disabled={isSubmitting}
				></textarea>
			</div>

			{#if submitStatus}
				<div class="submit-status" class:error={submitStatus.includes('galt') || submitStatus.includes('wrong')}>
					{submitStatus}
				</div>
			{/if}

			<button type="submit" disabled={isSubmitting}>
				<span class="button-content">
					{#if isSubmitting}
						{$language === 'no' ? 'Sender...' : 'Sending...'}
					{:else}
						{t.contact.send}
					{/if}
				</span>
			</button>
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
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.contact-header p {
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto;
		font-size: clamp(1rem, 3vw, 1.2rem);
		line-height: 1.6;
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
		border-radius: 20px;
		box-shadow: var(--card-shadow);
		border: 2px solid transparent;
		transition: all 0.3s ease;
	}

	.contact-info:hover {
		border-color: var(--accent-primary);
		transform: translateY(-4px);
	}

	.contact-info h2 {
		color: var(--text-primary);
		font-size: clamp(1.5rem, 4vw, 2rem);
		margin-bottom: clamp(1.5rem, 4vw, 2rem);
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.info-item {
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
		padding: 1rem;
		background: var(--bg-primary);
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.info-item:hover {
		transform: translateY(-2px);
		box-shadow: var(--card-shadow);
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
		text-decoration: none;
	}

	.info-item a:hover {
		color: var(--accent-primary);
	}

	.social-links {
		margin-top: clamp(1.5rem, 4vw, 2rem);
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.social-links a {
		color: var(--text-primary);
		text-decoration: none;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		display: inline-flex;
		align-items: center;
		
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.social-links a:hover {
		color: var(--accent-primary);
		transform: translateY(-2px);
		box-shadow: var(--card-shadow);
	}

	.social-links svg {
		transition: transform 0.3s ease;
	}

	.social-links a:hover svg {
		transform: scale(1.1);
	}

	.contact-form {
		background-color: var(--bg-secondary);
		padding: clamp(1.5rem, 4vw, 2rem);
		border-radius: 20px;
		box-shadow: var(--card-shadow);
		border: 2px solid transparent;
		transition: all 0.3s ease;
	}

	.contact-form:hover {
		border-color: var(--accent-primary);
		transform: translateY(-4px);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
		font-size: clamp(0.9rem, 2.5vw, 1rem);
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid var(--bg-primary);
		border-radius: 12px;
		background: var(--bg-primary);
		color: var(--text-primary);
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		transition: all 0.3s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.1);
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: var(--text-secondary);
		opacity: 0.7;
	}

	button {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		color: white;
		border: none;
		border-radius: 12px;
		font-size: clamp(1rem, 3vw, 1.1rem);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.2);
	}

	button:hover::before {
		opacity: 1;
	}

	.button-content {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 768px) {
		.contact-content {
			grid-template-columns: 1fr;
		}

		.contact-info,
		.contact-form {
			transform: none;
		}

		.contact-info:hover,
		.contact-form:hover {
			transform: translateY(-2px);
		}
	}

	@media (max-width: 480px) {
		.social-links {
			flex-direction: column;
		}

		.social-links a {
			width: 100%;
			justify-content: center;
		}
	}

	.submit-status {
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		background: var(--accent-primary);
		color: white;
		text-align: center;
		font-size: 0.9rem;
		opacity: 0;
		animation: fadeIn 0.3s ease forwards;
	}

	.submit-status.error {
		background: #dc3545;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.info-item a {
		color: var(--text-primary);
		text-decoration: none;
		transition: color 0.2s;
	}

	.info-item a:hover {
		color: var(--accent-primary);
	}

	.location-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.location-link::before {
		content: '📍';
		font-size: 1.2rem;
	}
</style> 