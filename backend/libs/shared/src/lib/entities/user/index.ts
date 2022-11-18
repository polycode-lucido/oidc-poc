import { User } from './user.entity';
import { UserSettings } from './settings';
import { UserEmail } from './email';

export * from './user.entity';
export * from './email';
export * from './settings';

export const sequelizeUserModels = [User, UserSettings, UserEmail];
