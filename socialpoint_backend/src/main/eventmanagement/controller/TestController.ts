import { Controller, Get } from '@nestjs/common';

@Controller()  // No path prefix for root routes
export class TestController {
    @Get()
    root() {
        return { message: 'Welcome to the Event Management API!' };
    }

    @Get('api/test')
    test() {
        return { message: 'Backend is working!' };
    }
} 