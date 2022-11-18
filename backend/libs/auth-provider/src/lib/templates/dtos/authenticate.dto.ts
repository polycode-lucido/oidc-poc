import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';
import { OAuth2ClientGrant } from '../../entities/OAuth2ClientGrant.entity';

export class OAuth2AuthenticateDto {
  @ValidateIf((o) => o.grantType !== OAuth2ClientGrant.IMPLICIT)
  @IsUUID(4)
  clientId: string;

  @ValidateIf((o) => o.grantType !== OAuth2ClientGrant.IMPLICIT)
  @IsString()
  clientSecret: string;

  @IsEnum(OAuth2ClientGrant)
  grantType: OAuth2ClientGrant;

  @ValidateIf((o) =>
    [OAuth2ClientGrant.IMPLICIT, OAuth2ClientGrant.PASSWORD].includes(
      o.grantType
    )
  )
  @IsString()
  identity: string;

  @ValidateIf((o) =>
    [OAuth2ClientGrant.IMPLICIT, OAuth2ClientGrant.PASSWORD].includes(
      o.grantType
    )
  )
  @IsString()
  secret: string;
}
