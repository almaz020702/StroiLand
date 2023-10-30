import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { TokenPayload } from "src/auth/interfaces/token-payload.interface";

@Injectable()
export class UserAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		try {
			const token = req.cookies.accessToken;
			if (!token) {
				throw new UnauthorizedException({
					message: "User is not authorized",
				});
			}
			const payload: TokenPayload = this.jwtService.verify(token);
			if (!payload) {
				throw new UnauthorizedException({
					message: "Incorrect accessToken",
				});
			}
			req.user = payload;

			return true;
		} catch (e) {
			throw new UnauthorizedException({
				message: "User is not authorized",
			});
		}
	}
}
