import { StudentEntity } from 'src/entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class StudentSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<void> {
        const studentRepository: Repository<StudentEntity> =
            dataSource.getRepository(StudentEntity);

        const count = await studentRepository.count();
        if (count > 0) return;

        const students: Partial<StudentEntity>[] = [
            { id: 's1', email: 'studentbob@gmail.com', isSuspended: true },
            { id: 's2', email: 'studentagnes@gmail.com', isSuspended: false },
            { id: 's3', email: 'student_only_under_teacher_ken@gmail.com', isSuspended: false },
            { id: 's4', email: 'commonstudent1@gmail.com', isSuspended: false },
            { id: 's5', email: 'commonstudent2@gmail.com', isSuspended: false },
            { id: 's6', email: 'studentmitchel@gmail.com', isSuspended: false },
        ];

        await studentRepository.save(students);
    }
} 