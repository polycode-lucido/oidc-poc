import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { MailerConsumerService } from '@polycode/mailer-consumer';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { is409 } from '@polycode/to';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CreateEmailDto } from './templates/dtos/create-email.dto';
// import { AuthConsumerService } from '@polycode/auth-consumer';
import { GenericSequelizeService } from '@polycode/generic';
import { User, UserEmail } from '@polycode/shared';

@Injectable()
export class UserEmailService extends GenericSequelizeService<UserEmail> {
  constructor(
    private readonly mailerConsumerService: MailerConsumerService,
    // private readonly authConsumerService: AuthConsumerService,
    readonly sequelize: Sequelize
  ) {
    super(UserEmail, sequelize, {
      fields: ['id', 'email', 'isVerified'],
    });
  }

  /**
   * "Find a user email by email."
   *
   * The first parameter is the email we want to find. The second parameter is an optional parameter
   * that allows us to pass in query options
   * @param {string} email - string - The email address to search for
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a UserEmail object
   */
  async findByEmail(
    email: string,
    queryOptions: QueryOptions = {}
  ): Promise<UserEmail> {
    return this.model.findOne({ where: { email } });
  }

  /**
   * It returns a list of UserEmail objects that have a userId that matches the userId passed in
   * @param {string} userId - string - The userId to find all UserEmail's for
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to an array of UserEmail objects.
   */
  async findAllByUserId(
    userId: string,
    queryOptions: QueryOptions = {}
  ): Promise<UserEmail[]> {
    return QueryManager.findAll<UserEmail>(
      UserEmail,
      {
        where: {
          userId: userId,
        },
      },
      queryOptions
    );
  }

  /**
   * It creates a new email for a user, and sends a validation email
   * @param {CreateEmailDto} createEmailDto - CreateEmailDto - this is the DTO that will be used to
   * create the email.
   * @param {string} userId - string,
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The email object
   */
  async create(
    createEmailDto: CreateEmailDto,
    user: User,
    queryOptions: QueryOptions = {}
  ): Promise<UserEmail> {
    await this._findOne(
      { where: { email: createEmailDto.email } },
      { validator: is409, ...queryOptions }
    );

    const email = await QueryManager.create<UserEmail>(
      UserEmail,
      {
        ...createEmailDto,
        userId: user.id,
        verificationToken: this.generateValidationToken(),
      },
      queryOptions
    );

    try {
      await this.mailerConsumerService.sendVerificationEmail(
        email.email,
        user.username,
        email.verificationToken
      );
    } catch (err) {
      // skip email sending error
      Logger.error(err);
    }

    return email;
  }

  /**
   * It generates a validation token.
   * @returns A string
   */
  generateValidationToken(): string {
    return uuidv4();
  }

  /**
   * recreates a verification token for an email address and resends a validation mail.
   * @throws {ConflictException} - If the email is already verified
   * @param emailId - string - id of the email to verify
   */
  async regenerateValidationToken(emailId: string): Promise<void> {
    const userEmail = await this._findOne({
      where: { id: emailId },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (userEmail.isVerified)
      throw new ConflictException('Email was already verified.');

    const newToken = this.generateValidationToken();
    await this._updateById(userEmail.id, {
      verificationToken: newToken,
    });

    try {
      await this.mailerConsumerService.sendVerificationEmail(
        userEmail.email,
        userEmail.user.username,
        newToken
      );
    } catch (err) {
      // skip email sending error
      Logger.error('Could not send email: ' + err);
    }
  }

  /**
   * It finds an email by its verification token, and then updates it to remove the verification token
   * and set the isVerified flag to true
   * @param {string} token - The token that was sent to the user's email address.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async validateEmail(
    token: string,
    queryOptions: QueryOptions = {}
  ): Promise<void> {
    await QueryManager.createTransaction(queryOptions, this.sequelize);

    const email = await this._findOne(
      { where: { verificationToken: token } },
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.updateInstance(
      email,
      { verificationToken: null, isVerified: true },
      QueryManager.skipTransaction(queryOptions)
    );

    // await this.authConsumerService.addRoleToUser(
    //   email.userId,
    //   process.env.DEFAULT_VALIDATED_ROLE_ID,
    //   QueryManager.skipTransaction(queryOptions)
    // );

    await QueryManager.commitTransaction(queryOptions);
  }

  /**
   * It takes a UserEmail or an array of UserEmail and returns a partial of the same type
   * @param {UserEmail | UserEmail[]} email - UserEmail | UserEmail[]
   * @returns An array of UserEmail objects.
   */
  format(email: UserEmail | UserEmail[]): Partial<UserEmail | UserEmail[]> {
    if (Array.isArray(email)) {
      return email.map((email) => this.format(email) as UserEmail);
    }

    return {
      id: email.id,
      email: email.email,
      isVerified: email.isVerified,
    };
  }
}
