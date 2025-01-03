import { IsEmail, IsString, IsOptional, MinLength, Matches, IsNumber, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from "../model/UserRole";

export class CreateUserRequestDto {
 @IsEmail()
 @IsNotEmpty()
 email!: string;

 @IsString()
 @MinLength(8)
 @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
   message: 'Password must contain uppercase, lowercase, number/special character'
 })
 password!: string;

 @IsString()
 @MinLength(2)
 fullName!: string;

 @IsOptional()
 @Matches(/^\+?[1-9]\d{1,14}$/)
 phoneNumber?: string;
}

export class UpdateUserRequestDto {
 @IsEmail()
 @IsOptional()
 email?: string;

 @IsString()
 @IsOptional()
 @MinLength(8)
 @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
 password?: string;

 @IsString()
 @IsOptional()
 @MinLength(2)
 fullName?: string;

 @IsOptional()
 @Matches(/^\+?[1-9]\d{1,14}$/)
 phoneNumber?: string;
}

export class AddFriendRequestDto {
 @IsNumber()
 @IsNotEmpty()
 friendId!: number;
}

export class UserEventRoleRequestDto {
 @IsNumber()
 @IsNotEmpty()
 eventId!: number;

 @IsEnum(Role)
 @IsNotEmpty()
 role!: Role;
}

export class UserResponseDto {
 @IsNumber()
 id!: number;

 @IsEmail()
 email!: string;

 @IsString()
 fullName!: string;

 @IsOptional()
 @IsString()
 phoneNumber?: string;

 @IsArray()
 friends!: UserFriendResponseDto[];

 @IsArray()
 eventRoles!: UserEventRoleResponseDto[];
}

export class UserFriendResponseDto {
 @IsNumber()
 id!: number;

 @IsString()
 fullName!: string;
}

export class UserEventRoleResponseDto {
 @IsNumber()
 userId!: number;

 @IsNumber()
 eventId!: number;

 @IsEnum(Role)
 role!: string;

 @IsString()
 eventName!: string;
}