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
			title: "Hei, Jeg er Daniel",
			subtitle: "En Full-Stack Utvikler & Designer",
		},
		projects: {
			title: "Mine Prosjekter",
			description:
				"Her er en samling av mitt nylige arbeid og personlige prosjekter",
			viewProject: "Se Prosjekt",
		},
		about: {
			title: "Om Meg",
			background: "Bakgrunn",
			experience: "Erfaring",
			education: "Utdanning",
		},
		contact: {
			title: "Ta Kontakt",
			intro: "Jeg er alltid åpen for nye muligheter og samarbeid. Ta gjerne kontakt!",
			name: "Navn",
			email: "E-post",
			message: "Melding",
			send: "Send Melding",
			location: "Sted",
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
			subtitle: "A Full-Stack Developer & Designer",
		},
		projects: {
			title: "My Projects",
			description:
				"Here's a collection of my recent work and personal projects",
			viewProject: "View Project",
		},
		about: {
			title: "About Me",
			background: "Background",
			experience: "Experience",
			education: "Education",
		},
		contact: {
			title: "Get in Touch",
			intro: "I'm always open to new opportunities and collaborations. Feel free to reach out!",
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
