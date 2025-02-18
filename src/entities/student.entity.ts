import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeacherStudentEntity } from './student-teacher.entity';
import { TeacherEntity } from './teacher.entity';

@Entity('student')
export class StudentEntity extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @Column({ default: false })
    isSuspended?: boolean

    @OneToMany(() => TeacherStudentEntity, (teacherStudent) => teacherStudent.student)
    teachers?: TeacherEntity[]
}

