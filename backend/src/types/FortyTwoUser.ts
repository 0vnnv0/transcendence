export interface FortyTwoUser {
	id: number;
	login: string;
	email: string;
	first_name: string;
	last_name: string;

	url: string;

	image?: {
		versions?: {
			large?: string;
		};
	};

	"active?": boolean;
	"alumni?": boolean;
}