import { Transform } from "class-transformer"
import { isArray, IsEmail, IsString } from "class-validator"

export class RegisterDto {
    @IsString()
    teacher: string

    @IsString({ each: true })
    students: string[]
}

export class GetCommonStudentsQuery {
    @IsEmail({}, { each: true })
    @Transform(({ value }) => isArray(value) ? value : [value])
    teacher: string[]
}

export class SuspendDto {
    @IsString()
    student: string
}

export class RetrieveNotificationDto {
    @IsString()
    teacher: string

    @IsString()
    notification: string
}