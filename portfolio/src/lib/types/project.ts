export interface Project {
	id?: number;
	title: {
		no: string;
		en: string;
	};
	description: {
		no: string;
		en: string;
	};
	technologies: string[];
	image: string;
	link: string;
	placement?: number;
	featured?: boolean;
}
