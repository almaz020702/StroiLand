import { Payload } from "./interfaces/token-payload.interface";

export declare global {
	type AnyObject = Record<string, unknown>;

	namespace Express {
		interface Request {
			user: Payload
		}
	}
}