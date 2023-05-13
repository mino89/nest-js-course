import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdasd@asd.it', password: 'asas' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User])
      },
      // remove: () => { },
      // update: () => { }
    }
    fakeAuthService = {
      // signup: () => { },
      signIn: (email:string, password:string) => { 
        return Promise.resolve({id:1, email, password} as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    {
      const users = await controller.findAllUsers('asdf@asdf.com')
      expect(users.length).toBe(1)
      expect(users[0].email).toBe('asdf@asdf.com')
    }

  })

  it('findUser returns a signle user with the given id', async ()=>{
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })
  
  it('findUser throws an error if user with given id is not found', async()=>{
    fakeUsersService.findOne = () => null
    const user = controller.findUser('1')
    await expect(user).rejects.toThrow(NotFoundException)
  })

  it('signIn updates session object and return user', async ()=>{
    const session = { userId: 0}
    const user = await controller.signin(
      {
        email:'asdf@aasd.it', 
        password:'asdasd'
      }, 
      session)
      expect(user.id).toEqual(1)
      expect(session.userId).toEqual(1)
  })
});
