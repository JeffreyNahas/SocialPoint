import { Controller, Post, Get, Put, Body, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { UserAccountService } from '../service/UserAccountService';
import { CreateUserAccountRequestDto } from '../dto/UserAccountDto';
import { LoginUserAccountRequestDto } from '../dto/UserAccountDto';
import { UserAccountResponseDto } from '../dto/UserAccountDto';
import { UserAccount } from '../model/UserAccount';
import { CreateUserRequestDto } from '../dto/UserDto';

@Controller('api/user-accounts')
export class UserAccountController {
   constructor(private readonly userAccountService: UserAccountService) {}

   @Post()
   async createUserAccount(@Body() createDto: CreateUserRequestDto) {
       try {
           const userAccount = await this.userAccountService.createUserAccount(
               createDto.fullName,
               createDto.email,
               createDto.phoneNumber || '',
               createDto.password
           );
           return userAccount;
       } catch (error: unknown) {
           console.error('Error creating user account:', error);
           if (error instanceof Error) {
               if (error.message.includes('duplicate')) {
                   throw new HttpException('Email already exists', HttpStatus.CONFLICT);
               }
               throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
           }
           throw new HttpException('Failed to create user account', HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }

   @Post('login')
   async login(@Body() loginDto: LoginUserAccountRequestDto): Promise<UserAccountResponseDto> {
       try {
           const userAccount = await this.userAccountService.loginUserAccount(
               loginDto.email,
               loginDto.password
           );
           return this.mapToResponseDto(userAccount);
       } catch (error) {
           throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
       }
   }

   @Post(':id/logout')
   async logout(@Param('id') id: number): Promise<void> {
       try {
           await this.userAccountService.logoutUserAccount(id);
       } catch (error) {
           throw new HttpException('Failed to logout', HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id')
   async getUserAccount(@Param('id') id: number): Promise<UserAccountResponseDto> {
       const userAccount = await this.userAccountService.getUserAccountById(id);
       if (!userAccount) {
           throw new HttpException('User account not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(userAccount);
   }

   private mapToResponseDto(userAccount: UserAccount): UserAccountResponseDto {
    const response = new UserAccountResponseDto();
    response.id = userAccount.id;
    response.fullName = userAccount.getFullName();
    response.email = userAccount.getEmail();
    response.phoneNumber = userAccount.getPhoneNumber();
    return response;
   }
}