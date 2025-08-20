import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateUrlDto } from './create-url.dto';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
