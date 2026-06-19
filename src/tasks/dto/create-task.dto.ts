import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Prepare weekly report',
    description: 'Task title',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Collect task progress and send the report to the team',
    description: 'Task details',
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    example: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    example: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-06-30',
    description: 'Task due date',
  })
  @IsString()
  @IsOptional()
  dueDate?: string;
}
