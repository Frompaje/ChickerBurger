import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdatedPasswordUserDto {
  @IsString()
  @Length(3)
  password: string;

  @IsString()
  id: string;
}
