import { ApiHideProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity {
    @Expose()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date

    @Expose()
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date

    @ApiHideProperty()
    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt?: Date
}
