import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() public?: boolean;
}

export class UpdateSiteDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() domain?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() public?: boolean;
}
