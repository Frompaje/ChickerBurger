import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../decorator/role.enum';
import { UserService } from '../services/user.service';
import { UpdatedPasswordUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.User)
  @HttpCode(201)
  async create(@Body() body: CreateUserDto) {
    const { name, password, email, address } = body;

    return await this.userService.create({
      name,
      password,
      email,
      address,
    });
  }
  @Post()
  @Roles(Role.User)
  @UseGuards()
  async updatedPassword(@Body() body: UpdatedPasswordUserDto) {
    const { id, password } = body;

    return await this.userService.updatedPassword({
      id,
      password,
    });
  }
}
