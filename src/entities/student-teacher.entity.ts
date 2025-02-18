import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity('teacher_student')
export class TeacherStudentEntity extends BaseEntity {
    @PrimaryColumn()
    studentId: string;

    @PrimaryColumn()
    teacherId: string;

    @ManyToOne(() => StudentEntity, (student) => student.teachers)
    @JoinColumn([{ name: 'studentId', referencedColumnName: 'id' }])
    student?: StudentEntity;

    @ManyToOne(() => TeacherEntity, (teacher) => teacher.students)
    @JoinColumn([{ name: 'teacherId', referencedColumnName: 'id' }])
    teacher?: TeacherEntity;
}
