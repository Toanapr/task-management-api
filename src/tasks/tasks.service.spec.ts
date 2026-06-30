import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from '../schemas/task.schema';
import { NotFoundException } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '../common/enums/task-status.enum';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  const task = {
    id: 'task-1',
    title: 'Prepare report',
    description: 'Collect weekly progress',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
  };

  beforeEach(async () => {
    taskModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: taskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = {
      title: task.title,
      description: task.description,
      priority: task.priority,
    };
    taskModel.create.mockResolvedValue(task);

    await expect(service.create(createTaskDto)).resolves.toEqual(task);
    expect(taskModel.create).toHaveBeenCalledWith(createTaskDto);
  });

  it('should find all tasks using filters and sort newest first', async () => {
    const exec = jest.fn().mockResolvedValue([task]);
    const sort = jest.fn().mockReturnValue({ exec });
    taskModel.find.mockReturnValue({ sort });

    const query = {
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      search: 'report',
    };

    await expect(service.findAll(query)).resolves.toEqual([task]);
    expect(taskModel.find).toHaveBeenCalledWith({
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      $or: [
        {
          title: {
            $regex: 'report',
            $options: 'i',
          },
        },
        {
          description: {
            $regex: 'report',
            $options: 'i',
          },
        },
      ],
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(exec).toHaveBeenCalled();
  });

  it('should find one task by id', async () => {
    taskModel.findById.mockResolvedValue(task);

    await expect(service.findOne(task.id)).resolves.toEqual(task);
    expect(taskModel.findById).toHaveBeenCalledWith(task.id);
  });

  it('should throw NotFoundException when task is not found by id', async () => {
    taskModel.findById.mockResolvedValue(null);

    await expect(service.findOne(task.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update a task by id', async () => {
    const updateTaskDto = { status: TaskStatus.DONE };
    const updatedTask = { ...task, ...updateTaskDto };
    const exec = jest.fn().mockResolvedValue(updatedTask);
    taskModel.findByIdAndUpdate.mockReturnValue({ exec });

    await expect(service.update(task.id, updateTaskDto)).resolves.toEqual(
      updatedTask,
    );
    expect(taskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      task.id,
      updateTaskDto,
      {
        new: true,
        runValidators: true,
      },
    );
  });

  it('should throw NotFoundException when updating a missing task', async () => {
    const exec = jest.fn().mockResolvedValue(null);
    taskModel.findByIdAndUpdate.mockReturnValue({ exec });

    await expect(service.update(task.id, {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should remove a task by id', async () => {
    const exec = jest.fn().mockResolvedValue(task);
    taskModel.findByIdAndDelete.mockReturnValue({ exec });

    await expect(service.remove(task.id)).resolves.toBeUndefined();
    expect(taskModel.findByIdAndDelete).toHaveBeenCalledWith(task.id);
  });

  it('should throw NotFoundException when removing a missing task', async () => {
    const exec = jest.fn().mockResolvedValue(null);
    taskModel.findByIdAndDelete.mockReturnValue({ exec });

    await expect(service.remove(task.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
