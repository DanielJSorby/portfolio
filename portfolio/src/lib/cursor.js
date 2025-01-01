if (typeof window !== "undefined") {
	document.addEventListener("mousemove", (e) => {
		const x = (e.clientX / window.innerWidth) * 100;
		const y = (e.clientY / window.innerHeight) * 100;
		document.documentElement.style.setProperty("--cursor-x", `${x}%`);
		document.documentElement.style.setProperty("--cursor-y", `${y}%`);
	});
}
