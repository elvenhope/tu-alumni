export interface Headline {
	id?: string,
	headline: string;
	author: string;
	description: string;
	active: boolean;
}

export interface Event {
	id?: string,
	day: number;
	month: number;
	headline: string;
	description: string;
	image: string;
	active: boolean;
}

export interface HomePageContent {
	headlines: Headline[];
	events: Event[];
}
