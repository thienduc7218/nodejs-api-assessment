import { TeacherEntity } from 'src/entities/teacher.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class TeacherSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        const teacherRepository: Repository<TeacherEntity> =
            dataSource.getRepository(TeacherEntity);

        const count = await teacherRepository.count();
        if (count > 0) return;

        const teachers: Partial<TeacherEntity>[] = [
            { id: 't1', email: 'teacherCook@gmail.com' },
            { id: 't2', email: 'teacherTim@gmail.com' },
        ];

        await teacherRepository.save(teachers);
    }
}