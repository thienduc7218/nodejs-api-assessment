import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetCommonStudentsQuery, RegisterDto, RetrieveNotificationDto, SuspendDto } from './teachers.dto'
import { CommonStudentsResponse, RetrieveNotificationResponse } from './teachers.responses'
import { TeachersService } from './teachers.service'

@ApiTags('Teachers')
@Controller()
export class TeachersController {
  constructor(private readonly service: TeachersService) { }

  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  register(@Body() body: RegisterDto): Promise<void> {
    return this.service.register(body)
  }

  @Get('/commonstudents')
  @HttpCode(HttpStatus.OK)
  getCommonStudents(@Query() query: GetCommonStudentsQuery): Promise<CommonStudentsResponse> {
    return this.service.getCommonStudents(query)
  }

  @Post('/suspend')
  @HttpCode(HttpStatus.OK)
  suspend(@Body() body: SuspendDto): Promise<void> {
    return this.service.suspend(body)
  }

  @Post('/retrievefornotifications')
  @HttpCode(HttpStatus.OK)
  retrieveForNotifications(@Body() body: RetrieveNotificationDto): Promise<RetrieveNotificationResponse> {
    return this.service.retrieveForNotifications(body)
  }
}
