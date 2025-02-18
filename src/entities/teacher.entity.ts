import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeacherStudentEntity } from './student-teacher.entity';
import { StudentEntity } from './student.entity';

@Entity('teacher')
export class TeacherEntity extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @OneToMany(() => TeacherStudentEntity, (teacherStudent) => teacherStudent.teacher)
    students?: StudentEntity[]
}

