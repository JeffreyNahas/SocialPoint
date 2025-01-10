import { Controller, Post, Get, Put, Body, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { UserAccountService } from '../service/UserAccountService';
import { CreateUserAccountRequestDto } from '../dto/UserAccountDto';
import { LoginUserAccountRequestDto } from '../dto/UserAccountDto';
import { UserAccountResponseDto } from '../dto/UserAccountDto';
import { UserAccount } from '../model/UserAccount';

@Controller('user-accounts')
export class UserAccountController {
   constructor(private readonly userAccountService: UserAccountService) {}

   @Post()
   async createUserAccount(@Body() createDto: CreateUserAccountRequestDto): Promise<UserAccountResponseDto> {
       try {
           const userAccount = await this.userAccountService.createUserAccount(
               createDto.fullName,
               createDto.email,
               createDto.phoneNumber,
               createDto.password
           );
           return this.mapToResponseDto(userAccount);
       } catch (error) {
           throw new HttpException('Failed to create user account', HttpStatus.BAD_REQUEST);
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