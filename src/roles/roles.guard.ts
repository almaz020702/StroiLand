import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return true; // No roles defined, access granted
    }
  
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming you have a way to get the user's ID from the request.
  
    if (!userId) {
      return false; // User is not authenticated, access denied
    }
  
    // Fetch the user's roles from the database using Prisma or your chosen data access method.
    const userRoles = await this.userService.getUserRoles(userId);
  
    // Check if the user has the required roles to access the endpoint
    const hasRequiredRoles = roles.some((role) => userRoles.includes(role));
  
    return hasRequiredRoles;
  }
  
  
}
