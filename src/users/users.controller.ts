import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService) { }
  @Post('/signup')
   createUser(@Body() body: CreateUserDto) {
   return this.authService.signup(body.email, body.password)
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto){
    return this.authService.signIn(body.email,body.password)
  }


  @Get(`/:id`)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id))
    if (!user){
      throw new NotFoundException('No user found!')
    }
    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string){
    return this.usersService.find(email)
  }

  @Delete(`/:id`)
  removeUser(@Param('id') id: string){
    return this.usersService.remove(parseInt(id))
  }
  
  @Patch(`/:id`)
  updateUser(@Param('id') id:string, @Body() body: UpdateUserDto){
    return this.usersService.update(parseInt(id), body)
  }
}