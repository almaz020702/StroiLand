export interface User {
	user_id: number;
	email: string;
    password: string;
	first_name: string;
	last_name: string;
	phone_number: string;
    activationToken: string;
	isActivated: boolean;
}
