// apps/backend/src/social/dto/social.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RespondConnectionDto {
  @IsEnum(['ACCEPTED', 'REJECTED'])
  status: 'ACCEPTED' | 'REJECTED';
}

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty()
  q: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}