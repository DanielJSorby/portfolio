import { writable } from "svelte/store";

type Language = "no" | "en";

interface Translation {
	nav: {
		home: string;
		projects: string;
		about: string;
		contact: string;
	};
	hero: {
		title: string;
		subtitle: string;
	};
	projects: {
		title: string;
		description: string;
		viewProject: string;
	};
	about: {
		title: string;
		background: string;
		experience: string;
		education: string;
	};
	contact: {
		title: string;
		description: string;
		send: string;
	};
	footer: {
		rights: string;
		email: string;
		contact: string;
		navigation: string;
		description: string;
	};
}

type TranslationsType = {
	[K in Language]: Translation;
};

export const translations: TranslationsType = {
	no: {
		nav: {
			home: "Hjem",
			projects: "Prosjekter",
			about: "Om meg",
			contact: "Kontakt",
		},
		hero: {
			title: "Hei, jeg er Daniel",
			subtitle: "Full-Stack Utvikler & Designer",
		},
		projects: {
			title: "Mine Prosjekter",
			description: "Her er noen av prosjektene jeg har jobbet med",
			viewProject: "Se prosjekt",
		},
		about: {
			title: "Om Meg",
			background: "Bakgrunn",
			experience: "Erfaring",
			education: "Utdanning",
		},
		contact: {
			title: "Ta Kontakt",
			description: "Send meg en melding",
			send: "Send Melding",
		},
		footer: {
			rights: "Alle rettigheter reservert.",
			email: "E-post",
			contact: "Kontakt",
			navigation: "Navigasjon",
			description:
				"Full-Stack Utvikler & Designer med fokus på moderne webteknologier og brukeropplevelse.",
		},
	},
	en: {
		nav: {
			home: "Home",
			projects: "Projects",
			about: "About",
			contact: "Contact",
		},
		hero: {
			title: "Hi, I'm Daniel",
			subtitle: "Full-Stack Developer & Designer",
		},
		projects: {
			title: "My Projects",
			description: "Here are some of the projects I've worked on",
			viewProject: "View project",
		},
		about: {
			title: "About Me",
			background: "Background",
			experience: "Experience",
			education: "Education",
		},
		contact: {
			title: "Get in Touch",
			description: "Send me a message",
			send: "Send Message",
		},
		footer: {
			rights: "All rights reserved.",
			email: "Email",
			contact: "Contact",
			navigation: "Navigation",
			description:
				"Full-Stack Developer & Designer focusing on modern web technologies and user experience.",
		},
	},
};

export const language = writable<Language>("no");
