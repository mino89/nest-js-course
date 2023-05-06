import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";
import { UserDto } from "src/users/dtos/user.dto";

interface ClassContstructor {
  new(...args: any[]): {}
}

export function Serialize(dto: ClassContstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}