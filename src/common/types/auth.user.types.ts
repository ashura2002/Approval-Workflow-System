import { JwtResponseType } from './IJwtResponse.type';

export class AuthUser extends Request {
  user: JwtResponseType;
}
