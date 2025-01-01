import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Get initial theme from localStorage or default to 'light'
const initialTheme = browser
	? localStorage.getItem("theme") || "light"
	: "light";

export const theme = writable(initialTheme);

// Update localStorage when theme changes
if (browser) {
	theme.subscribe((value) => {
		localStorage.setItem("theme", value);
		document.documentElement.setAttribute("data-theme", value);
	});
}
