import { IsBoolean } from 'class-validator';

export class PlaylistOwnerResDto {
  @IsBoolean()
  owner: boolean;
}
