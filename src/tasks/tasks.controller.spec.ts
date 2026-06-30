import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskPriority, TaskStatus } from '../common/enums/task-status.enum';

type TasksServiceMock = {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksServiceMock;

  const task = {
    id: 'task-1',
    title: 'Prepare report',
    description: 'Collect weekly progress',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksServiceMock>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = {
      title: task.title,
      description: task.description,
      priority: task.priority,
    };
    service.create.mockResolvedValue(task);

    await expect(controller.create(createTaskDto)).resolves.toEqual(task);
    expect(service.create).toHaveBeenCalledWith(createTaskDto);
  });

  it('should return count and data when finding all tasks', async () => {
    const query = { status: TaskStatus.PENDING };
    service.findAll.mockResolvedValue([task]);

    await expect(controller.findAll(query)).resolves.toEqual({
      count: 1,
      data: [task],
    });
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should find one task by id', async () => {
    service.findOne.mockResolvedValue(task);

    await expect(controller.findOne(task.id)).resolves.toEqual(task);
    expect(service.findOne).toHaveBeenCalledWith(task.id);
  });

  it('should update a task by id', async () => {
    const updateTaskDto = { status: TaskStatus.DONE };
    const updatedTask = { ...task, ...updateTaskDto };
    service.update.mockResolvedValue(updatedTask);

    await expect(controller.update(task.id, updateTaskDto)).resolves.toEqual(
      updatedTask,
    );
    expect(service.update).toHaveBeenCalledWith(task.id, updateTaskDto);
  });

  it('should remove a task and return a success message', async () => {
    service.remove.mockResolvedValue(undefined);

    await expect(controller.remove(task.id)).resolves.toEqual({
      message: 'Task deleted successfully',
    });
    expect(service.remove).toHaveBeenCalledWith(task.id);
  });
});
