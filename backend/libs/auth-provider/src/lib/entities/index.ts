import { OAuth2Client } from './OAuth2Client.entity';
import { OAuth2ClientGrants } from './OAuth2ClientGrant.entity';
import { OAuth2ClientUris } from './OAuth2ClientRedirectUri.entity';
import { OAuth2Token } from './OAuth2Token.entity';
import { Role } from './Role.entity';
import { RolePolicies } from './RolePolicies.entity';
import { Subject } from './Subject.entity';
import { SubjectCredentials } from './SubjectCredentials.entity';
import { SubjectRoles } from './SubjectRoles.entity';

export const sequelizeModels = [
  Subject,
  SubjectCredentials,
  SubjectRoles,
  OAuth2Client,
  OAuth2ClientGrants,
  OAuth2ClientUris,
  OAuth2Token,
  Role,
  RolePolicies,
];
