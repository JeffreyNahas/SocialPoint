import { IsDate, IsNotEmpty, IsNumber, IsOptional, Matches, MinLength } from "class-validator";

import { IsEmail } from "class-validator";

import { IsString } from "class-validator";

// dto/request/create-user-account.request.dto.ts
export class CreateUserAccountRequestDto {
    @IsString()
    @MinLength(2)
    fullName!: string;
  
    @IsEmail()
    @IsNotEmpty()
    email!: string;
  
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/)
    phoneNumber!: string;
  
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password!: string;
  }
  
  // dto/request/update-user-account.request.dto.ts
  export class UpdateUserAccountRequestDto {
    @IsOptional()
    @IsString()
    fullName?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @Matches(/^\+?[1-9]\d{1,14}$/)
    phoneNumber?: string;
  
    @IsOptional()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password?: string;
  }
  
  // dto/request/login-user-account.request.dto.ts
  export class LoginUserAccountRequestDto {
    @IsEmail()
    email!: string;
  
    @IsString()
    password!: string;
  }
  
  // dto/response/user-account.response.dto.ts
  export class UserAccountResponseDto {
    @IsNumber()
    id!: number;
  
    @IsString()
    fullName!: string;
  
    @IsEmail()
    email!: string;
  
    @IsString()
    phoneNumber!: string;
  
    @IsOptional()
    @IsString()
    sessionToken?: string;
  
    @IsDate()
    createdAt!: Date;
  
    @IsDate()
    updatedAt!: Date;
  }