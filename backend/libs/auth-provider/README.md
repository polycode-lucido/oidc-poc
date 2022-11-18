# Auth provider library

This is the library for authentication and authorization for Polycode.

## Getting Started

This module is responsible for providing the authentication and authorization functionality for Polycode.

- It is used by the [auth-consumer](../auth-consumer/README.md) module.
- It implements the OAuth2 framework with the `implicit` flow.
- It use JWT tokens for access and refresh tokens.

## Exports

#### AuthProviderModule

This is the main nest module for the library. It exports inside the Nest context the following providers:

* `AuthService`
* `SubjectService`
* `RoleService`
* `RolePolicyService`

#### AuthService

This service is responsible for authentication and authorization.
It exports the following methods:

* `authorize`

#### SubjectService

This service is responsible for managing subjects.
It exports the following methods:

* `getByUserId`
* `getByCredentials`
* `create`
* `addCredentials`
* `addRole`
* `removeRole`
* `addRoleToUser`
* `removeRoleToUser`

#### RoleService

This service is responsible for managing roles.
It exports the following methods:

* `create`
* `findOne`
* `findById`
* `findByName`
* `update`
* `delete`

#### RolePolicyService

This service is responsible for managing role policies.
It exports the following methods:

* `create`

## Deployment

This module requires a PostgreSQL database to be running.

Those environment variables must be set:

| Name                | Required | Default value    | Note                               |
| ------------------- | :------: | ---------------- | ---------------------------------- |
| AUTH_JWT_SECRET     |    ✅    | JWT_SECRET       | The secret used to sign JWT        |
| AUTH_JWT_ISSUER     |    ✅    | https://auth.app | The JWT issuer                     |
| AUTH_JWT_AUDIENCE   |    ✅    | https://api.app  | The JWT audience                   |
| AUTH_JWT_EXPIRES_IN |    ✅    | 86400            | Expiration in seconds for each JWT |

## Additional Documentation and Acknowledgments

* JWT documentation: [JWT](https://jwt.io/), [npm package](https://www.npmjs.com/package/jsonwebtoken)
* OAuth2 documentation: [RFC 6749](https://tools.ietf.org/html/rfc6749)
* PostgreSQL documentation: [PostgreSQL](https://www.postgresql.org/)
* Sequelize documentation: [Sequelize](https://sequelize.org/)
