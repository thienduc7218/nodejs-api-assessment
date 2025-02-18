import { BadRequestException, Injectable } from '@nestjs/common'
import { TeacherStudentEntity } from 'src/entities/student-teacher.entity'
import { StudentEntity } from 'src/entities/student.entity'
import { TeacherEntity } from 'src/entities/teacher.entity'
import { DataSource, In, Repository } from 'typeorm'
import { GetCommonStudentsQuery, RegisterDto, RetrieveNotificationDto, SuspendDto } from './teachers.dto'
import { CommonStudentsResponse, RetrieveNotificationResponse } from './teachers.responses'

@Injectable()
export class TeachersService {
  teacherRepo: Repository<TeacherEntity>
  teacherStudentRepo: Repository<TeacherStudentEntity>
  studentRepo: Repository<StudentEntity>
  constructor(private readonly dataSource: DataSource) {
    this.teacherRepo = this.dataSource.getRepository(TeacherEntity)
    this.teacherStudentRepo = this.dataSource.getRepository(TeacherStudentEntity)
    this.studentRepo = this.dataSource.getRepository(StudentEntity)
  }

  async register(payload: RegisterDto): Promise<void> {
    const { students, teacher } = payload

    const existed = await this.teacherRepo.findOneBy({ email: teacher })
    if (!existed) {
      throw new BadRequestException("Invalid teacher email")
    }
    const validStudents = await this.studentRepo.findBy({ email: In(students) })
    if (validStudents.length !== students.length) {
      throw new BadRequestException("Invalid students or someone is not existed")
    }

    const newTeacherStudents = validStudents
      .filter(stu => !stu.isSuspended)
      .map(stu => {
        return { teacherId: existed.id, studentId: stu.id }
      })

    await this.teacherStudentRepo.save(newTeacherStudents)
    return
  }

  async getCommonStudents(query: GetCommonStudentsQuery): Promise<CommonStudentsResponse> {
    const { teacher } = query

    const existed = await this.teacherRepo.findBy({ email: In(teacher) })
    if (existed.length !== teacher.length) {
      throw new BadRequestException("Invalid teachers email or someone is not existed")
    }

    const registeredStudentPairs = await this.teacherStudentRepo.findBy({ teacherId: In(existed.map(t => t.id)) })
    const studentIds = registeredStudentPairs.map(rs => rs.studentId)
    const registeredStudents = await this.studentRepo.findBy({ id: In(studentIds), isSuspended: false })

    return { students: registeredStudents.map(s => s.email) }
  }

  async suspend(payload: SuspendDto): Promise<void> {
    const { student } = payload
    const studentRepo = this.dataSource.getRepository(StudentEntity)

    const existed = await studentRepo.findOneBy({ email: student, isSuspended: false })
    if (!existed) {
      throw new BadRequestException("Invalid student email or student is already suspended")
    }

    existed.isSuspended = true
    await studentRepo.save(existed)
  }

  private extractEmails(text: string): string[] {
    const emailRegex = /@[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/g;
    const matches = text.match(emailRegex) || [];
    return matches.map((email: string) => email.substring(1)); // Remove @ prefix
  }

  async retrieveForNotifications(payload: RetrieveNotificationDto): Promise<RetrieveNotificationResponse> {
    const { teacher, notification } = payload
    const mentionedStudents = this.extractEmails(notification);
    const existed = await this.teacherRepo.findOneBy({ email: teacher })
    if (!existed) {
      throw new BadRequestException("Invalid teacher email")
    }

    const { students } = await this.getCommonStudents({ teacher: [teacher] })

    return { recipients: [...students, ...mentionedStudents] }
  }
}
