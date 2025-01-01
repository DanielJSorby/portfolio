import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Get initial language from localStorage or default to 'no'
const initialLang = browser ? localStorage.getItem("language") || "no" : "no";

export const language = writable(initialLang);

// Update localStorage when language changes
if (browser) {
	language.subscribe((value) => {
		localStorage.setItem("language", value);
	});
}

export const translations = {
	no: {
		nav: {
			home: "Hjem",
			projects: "Prosjekter",
			about: "Om Meg",
			contact: "Kontakt",
		},
		hero: {
			title: "Daniel Johan Sørby",
			subtitle: "Full-Stack Utvikler",
		},
		projects: {
			title: "Prosjekter",
			description: "Her er noen av prosjektene jeg har jobbet med.",
			viewProject: "Se Prosjekt",
		},
		about: {
			title: "Om Meg",
			background: "Bakgrunn",
			experience: "Erfaring",
			education: "Utdanning",
		},
		contact: {
			title: "Kontakt Meg",
			description:
				"Ta gjerne kontakt om du har noen spørsmål eller vil samarbeide!",
			getInTouch: "Kontaktinformasjon",
			name: "Navn",
			email: "E-post",
			message: "Melding",
			send: "Send Melding",
			location: "Lokasjon",
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
			title: "Daniel Johan Sørby",
			subtitle: "Full-Stack Developer",
		},
		projects: {
			title: "Projects",
			description: "Here are some of the projects I have worked on.",
			viewProject: "View Project",
		},
		about: {
			title: "About Me",
			background: "Background",
			experience: "Experience",
			education: "Education",
		},
		contact: {
			title: "Contact Me",
			description:
				"Feel free to reach out if you have any questions or want to collaborate!",
			getInTouch: "Get in Touch",
			name: "Name",
			email: "Email",
			message: "Message",
			send: "Send Message",
			location: "Location",
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
