import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Match } from 'src/shared/decorators/custom-validator.decorators';

export class LoginBodyDTO {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 20, { message: 'Password must 6 - 20 digit' })
  password: string;
}
export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({
    message: 'Name is must string',
  })
  name: string;
  @IsString()
  @Match('password')
  confirmPassword: string;
}
export class RegisterResDTO {
  id: number;
  email: string;
  name: string;
  @Exclude() password: string;
  createdAt: Date;
  updatedAt: Date;

  //   @Expose()
  //   get emailName() {
  //     return `${this.email} - ${this.name}`;
  //   }
  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginResDTO {
  accessToken: string;
  refreshToken: string;
  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }
}
export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}
export class RefreshTokenResDTO extends LoginResDTO {}
