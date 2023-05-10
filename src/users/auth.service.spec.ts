import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"
import { User } from "./user.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"


describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  const users: User[] = []
  beforeEach(async () => {
    fakeUsersService = {
      find: (email:string) => {
        const filteredUsers = users.filter(user => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user ={
          id: Math.floor(Math.random() * 99999), 
          email,
          password
        } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile()

    service = module.get(AuthService)

  })

  it('can create an instance of AuthService', async () => {
    //create a fake copy of usersService
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async () =>{
    const user = await service.signup('asdf@asdf.com', 'asdf')
    expect(user.password).not.toEqual('asdf')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user signs up with a mail tha is in use', async () => {
    await service.signup('asdf@asd.com', 'asdf')
    await expect(service.signup('asdf@asd.com', 'asdf'))
    .rejects.toThrow(
      BadRequestException
    )
  })

  it('it thorws if signin is called with an unused email',async () => {
    await expect (service.signIn('asdasd@asdas.it', 'asdas'))
    .rejects.toThrow(NotFoundException)
  })

  it('throws if an invalid passwor is provided',async () => {
    await service.signup('asdaasdasd@asdasd.it', 'lkjkls')
    await expect( 
      service.signIn('asdaasdasd@asdasd.it', 'lkjkl')
    ).rejects.toThrow(BadRequestException)
  })

  it('returns a user if correct password is provided',async () => {
  
    await service.signup( 'asdfss@asd.com', 'mypassword')
    const user = await service.signIn('asdfss@asd.com', 'mypassword')
    expect(user).toBeDefined()

  })
})
