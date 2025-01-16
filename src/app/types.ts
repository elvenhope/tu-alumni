export interface Headline {
	headline: string;
	author: string;
	description: string;
}

export interface Event {
	day: number;
	month: number;
	headline: string;
	description: string;
	image: string;
}

export interface HomePageContent {
	headlines: Headline[];
	events: Event[];
}
