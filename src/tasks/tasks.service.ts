import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private task: Task[] = [];
  private idCounter = 1;

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: String(this.idCounter++),
      ...createTaskDto,
      createAt: new Date(),
    };

    this.task.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.task;
  }

  findOne(id: number): Task {
    const task = this.task.find((task) => task.id === String(id));
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    Object.assign(task, updateTaskDto);

    return task;
  }

  remove(id: number): void {
    const task = this.findOne(id);

    this.task = this.task.filter((item) => item.id !== task.id);
  }
}
