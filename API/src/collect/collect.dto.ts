import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectPageviewDto {
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsString() pathname: string;
  @ApiProperty() @IsString() visitor_id: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() referrer?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() session_id?: string;

  // Session metadata (sent on first pageview)
  @ApiProperty({ required: false }) @IsOptional() @IsString() country?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() device?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() browser?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() os?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() utm_source?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() utm_medium?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() utm_campaign?: string;
}

export class CollectEventDto {
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsString() visitor_id: string;
  @ApiProperty() @IsString() session_id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsObject() props?: Record<string, unknown>;
}

export class UpdateDurationDto {
  @ApiProperty() @IsString() session_id: string;
  @ApiProperty() @IsString() pageview_id: string;
  @ApiProperty() @IsNumber() duration: number;
}
