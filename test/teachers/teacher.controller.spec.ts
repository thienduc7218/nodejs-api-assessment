import { TeachersController } from "src/teachers/teachers.controller";
import { TeachersService } from "src/teachers/teachers.service";
import ds from '../../src/db/db.config';

describe('Teacher Controller', () => {
    let teacherController: TeachersController;
    let teacherService: TeachersService;

    beforeEach(() => {
        teacherService = new TeachersService(ds);
        teacherController = new TeachersController(teacherService);
    });

    it('register should return void', async () => {
        jest.spyOn(teacherService, 'register').mockImplementation(() => Promise.resolve());

        await expect(teacherController.register({ teacher: '', students: [] })).resolves.not.toThrow()
    });

    it('get common students should return an array of students', async () => {
        jest.spyOn(teacherService, 'getCommonStudents').mockImplementation(() => Promise.resolve({ students: [] }));

        await expect(teacherController.getCommonStudents({ teacher: [''] })).resolves.toEqual({ students: [] })
    })

    it('suspend should return void', async () => {
        jest.spyOn(teacherService, 'suspend').mockImplementation(() => Promise.resolve());

        await expect(teacherController.suspend({ student: '' })).resolves.not.toThrow()
    });

    it('retrieve for notifications should return an array of students', async () => {
        jest.spyOn(teacherService, 'retrieveForNotifications').mockImplementation(() => Promise.resolve({ recipients: [] }));

        await expect(teacherController.retrieveForNotifications({ teacher: '', notification: '' })).resolves.toEqual({ recipients: [] })
    });
});
