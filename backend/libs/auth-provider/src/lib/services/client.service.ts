import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { OAuth2Client } from '../entities/OAuth2Client.entity';
import { OAuth2ClientGrants } from '../entities/OAuth2ClientGrant.entity';
import { OAuth2ClientUris } from '../entities/OAuth2ClientRedirectUri.entity';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  /**
   * It gets a client from the database
   * @param {string} clientId - The client ID of the client you want to get.
   * @param {string} [clientSecret] - The client secret of the client.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The client object
   */
  async getClient(
    clientId: string,
    clientSecret?: string,
    queryOptions: QueryOptions = {}
  ): Promise<OAuth2Client> {
    const client = await QueryManager.findOne<OAuth2Client | null>(
      OAuth2Client,
      {
        where: {
          id: clientId,
          ...(!!clientSecret && { secret: clientSecret }),
        },
        include: [
          {
            model: OAuth2ClientGrants,
            as: 'grants',
          },
          {
            model: OAuth2ClientUris,
            as: 'redirectUris',
          },
        ],
      },
      queryOptions
    );

    if (!client) {
      throw new UnauthorizedException('Invalid client: client is invalid');
    }

    return client;
  }
}
