import { BadRequestException } from "@nestjs/common";
import { TeacherStudentEntity } from "src/entities/student-teacher.entity";
import { StudentEntity } from "src/entities/student.entity";
import { TeacherEntity } from "src/entities/teacher.entity";
import { TeachersService } from "src/teachers/teachers.service";
import ds from '../../src/db/db.config';


describe("Teacher Service", () => {
    let teacherService: TeachersService;
    let teacherRepo = ds.getRepository(TeacherEntity);
    let studentRepo = ds.getRepository(StudentEntity);
    let teacherStudentRepo = ds.getRepository(TeacherStudentEntity);
    beforeEach(() => {
        teacherService = new TeachersService(ds);
    });

    describe('register', () => {
        it('register should return void', async () => {
            jest.spyOn(teacherRepo, 'findOneBy').mockResolvedValueOnce({ id: "1", email: 'teacher@test.com' });
            jest.spyOn(studentRepo, 'findBy').mockResolvedValueOnce([{ id: '1', email: 'stu1@test.com', isSuspended: false }, { id: '2', email: 'stu2@test.com', isSuspended: false }])
            jest.spyOn(teacherStudentRepo, 'save').mockResolvedValueOnce([{}] as any)
            const payload = {
                teacher: 'teacher@test.com',
                students: ['stu1@test.com', 'stu2@test.com']
            }

            await expect(teacherService.register(payload)).resolves.not.toThrow()
        });

        it('register should throw error if teacher not found', async () => {
            jest.spyOn(teacherRepo, 'findOneBy').mockResolvedValueOnce(null);
            const payload = {
                teacher: 'teacher@test.com',
                students: ['stu1@test.com', 'stu2@test.com']
            }
            await expect(teacherService.register(payload)).rejects.toThrow(new BadRequestException("Invalid teacher email"))
        })

        it('register should throw error if student not found', async () => {
            jest.spyOn(teacherRepo, 'findOneBy').mockResolvedValueOnce({ id: "1", email: 'teacher@test.com' });
            jest.spyOn(studentRepo, 'findBy').mockResolvedValueOnce([])

            const payload = {
                teacher: 'teacher@test.com',
                students: ['stu1@test.com', 'stu2@test.com']
            }
            await expect(teacherService.register(payload)).rejects.toThrow(new BadRequestException("Invalid students or someone is not existed"))
        })
    })

    describe('getCommonStudents', () => {
        it('getCommonStudents should return students', async () => {
            jest.spyOn(teacherRepo, 'findBy').mockResolvedValueOnce([{ id: "1", email: 'teacher@test.com' }]);
            jest.spyOn(teacherStudentRepo, 'findBy').mockResolvedValueOnce([{ teacherId: '1', studentId: '1' }, { teacherId: '1', studentId: '2' }])
            jest.spyOn(studentRepo, 'findBy').mockResolvedValueOnce([{ id: '1', email: 'stu1@test.com', isSuspended: false }, { id: '2', email: 'stu2@test.com', isSuspended: false }])

            const query = { teacher: ['teacher@test.com'] }
            await expect(teacherService.getCommonStudents(query)).resolves.toEqual({
                students: ['stu1@test.com', 'stu2@test.com']
            })

        })

        it('getCoomonStudents should throw error if teacher not found', async () => {
            jest.spyOn(teacherRepo, 'findBy').mockResolvedValueOnce([]);
            const query = { teacher: ['teacher@test.com'] }
            await expect(teacherService.getCommonStudents(query)).rejects.toThrow(new BadRequestException("Invalid teachers email or someone is not existed"))
        })
    })

    describe('suspend', () => {
        it('suspend should return void', async () => {
            jest.spyOn(studentRepo, 'findOneBy').mockResolvedValueOnce({ id: '1', email: 'stu1@test.com' });
            jest.spyOn(studentRepo, 'save').mockResolvedValueOnce({} as any)

            const payload = { student: 'stu1@test.com' }
            await expect(teacherService.suspend(payload)).resolves.not.toThrow()
        })

        it('suspend should throw if invalid student', async () => {
            jest.spyOn(studentRepo, 'findOneBy').mockResolvedValueOnce(null)

            const payload = { student: 'stu1@test.com' }
            await expect(teacherService.suspend(payload)).rejects.toThrow(new BadRequestException("Invalid student email or student is already suspended"))
        })
    })



    it('retrieveNotification should return students', async () => {
        jest.spyOn(teacherRepo, 'findOneBy').mockResolvedValueOnce({ id: "1", email: 'teacher@test.com' });
        jest.spyOn(teacherService, 'getCommonStudents').mockResolvedValueOnce({
            students: ['stu1@test.com', 'stu2@test.com']
        })

        await expect(teacherService.retrieveForNotifications({
            teacher: "teacher@test.com",
            notification: "Hello students! @stu3@test.com @stu4@test.com"
        })).resolves.toEqual(
            {
                recipients:
                    ['stu1@test.com', 'stu2@test.com', 'stu3@test.com', 'stu4@test.com']
            }
        )
    })

    it('retrieveNotification should throw error if teacher not found', async () => {
        jest.spyOn(teacherRepo, 'findOneBy').mockResolvedValueOnce(null);
        await expect(teacherService.retrieveForNotifications({
            teacher: "teacher@test.com",
            notification: "Hello students!"
        })).rejects.toThrow(new BadRequestException("Invalid teacher email"))

    })
})