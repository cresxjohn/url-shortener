import {
  IsUrl,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/very-long-url' })
  @IsUrl()
  longUrl: string;

  @ApiProperty({ example: 'my-custom-link', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customSlug?: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
