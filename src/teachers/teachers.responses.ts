import { Expose } from "class-transformer";

export class CommonStudentsResponse {
    @Expose()
    students: string[]
}

export class RetrieveNotificationResponse {
    @Expose()
    recipients: string[]
}