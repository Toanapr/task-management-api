import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';

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

  findAll(query: GetTasksQueryDto): Task[] {
    const { status, priority, search } = query;

    let filteredTasks = [...this.task];

    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priority,
      );
    }

    if (search) {
      const keyword = search.toLowerCase();

      filteredTasks = filteredTasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword)
        );
      });
    }

    return filteredTasks;
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
