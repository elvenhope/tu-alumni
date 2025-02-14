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
	year: number;
	headline: string;
	description: string;
	image: string;
	active: boolean;
}

export interface BulletPoint {
	id?: string,
	description: string;
	image: string;
	active: boolean;
}

export interface HomePageContent {
	headlines: Headline[];
	events: Event[];
	bulletPoints: BulletPoint[];
}


export interface Gallery {
	id?: string;
	thumbnail: string;
	day: number;
	month: number;
	year: number;
	headline: string;
	description: string;
	active: boolean;
	storageName: string;
}

export interface Article {
	id?: string;
	headline: string;
	description: string;
	image: string;
	author?: string;
	day?: number;
	month?: number;
	year?: number;
	active: boolean;
	aboutUs?: boolean;
	featured: boolean;
}

export interface GalleryImagesObject {
	storageName: string;
	images: {
		url: string;
	}[];
}

export interface AboutUsContent {
	mainArticle: Article;
	galleries: Gallery[];
	galleryImages: GalleryImagesObject[];
}

export interface EventsPageContent {
	events: Event[];
}