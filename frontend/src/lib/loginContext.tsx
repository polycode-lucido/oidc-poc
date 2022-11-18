import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { getUserEmails, User, UserEmail } from './api/user';
import {
  Credentials,
  RefreshUser,
  fetchApiWithAuth,
  CredentialsManager,
} from './api/api';

/*
  Login context.
  This context is used to manage the login state : currently logged user, access token and refresh tokens.

  This context provides the following properties : 
  - user : the currently logged user, undefined means the user data is being fetched, null means no user is logged
  - refreshUser : a function to refresh the user data
  - credentialsManager : a structure containing a Credential object (accessToken and refreshToken) and a function to update the tokens
  - validUser : true if the user is logged with a verified email, false if not connected or not verified. Undefined when the user or the mails is loading.
  - userEmails : the list of emails of the user, undefined when the user and emails are loading, null when no user is logged

  To log out just set the tokens to undefined.

  Api calls that needs authentication will require the credentialsManager to be provided. This allows to refresh the tokens if needed.
*/

interface LoginContextInterface {
  user: User | undefined | null;
  credentialsManager: CredentialsManager;
  refreshUser: RefreshUser;
  validUser: boolean | undefined;
  emails: UserEmail[] | null | undefined;
}

/**
 * Reads the local storage for the access and refresh tokens
 * @returns {Credentials | undefined}
 */
function readLocalStorage(): Credentials | undefined {
  const jsonCredentials = localStorage.getItem('credentials');

  if (jsonCredentials) return JSON.parse(jsonCredentials);

  return undefined;
}

/**
 * Writes the tokens in local storage
 * @param credentials {Credentials | undefined}
 */
function writeLocalStorage(credentials: Credentials | undefined) {
  if (credentials) {
    localStorage.setItem('credentials', JSON.stringify(credentials));
  } else {
    localStorage.removeItem('credentials');
  }
}

/**
 * Manages the login status of the user and the tokens
 *
 */
export function useCreateLoginContext(): LoginContextInterface {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [credentials, internalSetCredentials] = useState<
    Credentials | undefined
  >(undefined);
  const [emails, setEmails] = useState<UserEmail[] | null | undefined>(
    undefined
  );

  // Read the local storage at start
  useEffect(() => {
    const localCredentials = readLocalStorage();

    if (localCredentials) internalSetCredentials(localCredentials);
    else {
      setUser(null);
    }
  }, []);

  const setCredentials = useCallback((newCreds: Credentials | undefined) => {
    writeLocalStorage(newCreds);
    internalSetCredentials(newCreds);
    if (!newCreds) setUser(null);
  }, []);

  const credentialsManager = useMemo(
    () => ({ credentials, setCredentials }),
    [credentials, setCredentials]
  );

  const refreshUser = useCallback(() => {
    if (credentialsManager.credentials) {
      fetchApiWithAuth<{}, User>('/user/@me', credentialsManager)
        .then(({ data, status }) => {
          if (status === 200) setUser(data);
          else setUser(null);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [credentialsManager]);

  // Fetch the user on credentials change
  useEffect(() => {
    refreshUser();
  }, [credentialsManager, refreshUser]);

  const refreshEmail = useCallback(() => {
    if (credentialsManager.credentials && user) {
      getUserEmails(credentialsManager, user.id)
        .then((data) => {
          setEmails(data);
        })
        .catch(() => {
          setEmails(null);
        });
    }
  }, [credentialsManager, user]);

  useEffect(() => {
    refreshEmail();
  }, [user, refreshEmail]);

  const validUser = useMemo(() => {
    if (user === undefined || emails === undefined) return undefined;
    if (user === null || emails === null) return false;
    return emails[0].isVerified;
  }, [emails, user]);

  const value = useMemo(
    () => ({
      user,
      credentialsManager,
      refreshUser,
      validUser,
      emails,
    }),
    [user, credentialsManager, refreshUser, validUser, emails]
  );

  return value;
}

/**
 * Create a context for the login state
 */
export const LoginContext = createContext<LoginContextInterface>({
  user: undefined,
  credentialsManager: { credentials: undefined, setCredentials: () => {} },
  refreshUser: () => {},
  emails: [],
  validUser: undefined,
});

export function LoginContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useCreateLoginContext();

  return (
    <LoginContext.Provider value={context}>{children}</LoginContext.Provider>
  );
}

// Retrieves the login context from the context provider
export function useLoginContext(): LoginContextInterface {
  return useContext(LoginContext);
}

// Redirects the user to the correct page if he is not logged in or its email is not verified
// validUser undefined means the informations are loading
export function useRequireValidUser() {
  const context = useLoginContext();
  const { user, validUser } = context;
  const router = useRouter();

  useEffect(() => {
    // user not logged in
    if (user === null) router.push('/sign-in');
    // loading
    if (typeof validUser === 'undefined' || typeof user === 'undefined') return;
    // user not verified
    if (!validUser) router.push('/verify-email');
  }, [validUser, user, router]);

  return context;
}
