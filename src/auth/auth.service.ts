import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new auth';
  }
}
