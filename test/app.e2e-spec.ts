import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { TasksController } from './../src/tasks/tasks.controller';
import { TasksService } from './../src/tasks/tasks.service';
import {
  TaskPriority,
  TaskStatus,
} from './../src/common/enums/task-status.enum';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let tasksService: jest.Mocked<TasksService>;

  const task = {
    id: 'task-1',
    title: 'Prepare report',
    description: 'Collect weekly progress',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
  };

  beforeEach(async () => {
    const tasksServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, TasksController],
      providers: [
        AppService,
        {
          provide: TasksService,
          useValue: tasksServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    tasksService = moduleFixture.get(TasksService);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/tasks (POST)', () => {
    const createTaskDto = {
      title: task.title,
      description: task.description,
      priority: task.priority,
    };
    tasksService.create.mockResolvedValue(task);

    return request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201)
      .expect(task);
  });

  it('/tasks (GET)', () => {
    tasksService.findAll.mockResolvedValue([task]);

    return request(app.getHttpServer())
      .get('/tasks')
      .query({ status: TaskStatus.PENDING })
      .expect(200)
      .expect({
        count: 1,
        data: [task],
      });
  });

  it('/tasks/:id (GET)', () => {
    tasksService.findOne.mockResolvedValue(task);

    return request(app.getHttpServer())
      .get(`/tasks/${task.id}`)
      .expect(200)
      .expect(task);
  });

  it('/tasks/:id (PATCH)', () => {
    const updatedTask = { ...task, status: TaskStatus.DONE };
    tasksService.update.mockResolvedValue(updatedTask);

    return request(app.getHttpServer())
      .patch(`/tasks/${task.id}`)
      .send({ status: TaskStatus.DONE })
      .expect(200)
      .expect(updatedTask);
  });

  it('/tasks/:id (DELETE)', () => {
    tasksService.remove.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .delete(`/tasks/${task.id}`)
      .expect(200)
      .expect({
        message: 'Task deleted successfully',
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
