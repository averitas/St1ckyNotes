import { Platform } from 'react-native';
import PublicClientApplication from 'react-native-msal';
import type { MSALAccount, MSALConfiguration, /*, etc */ 
MSALInteractiveParams,
MSALResult,
MSALSignoutParams,
MSALSilentParams} from 'react-native-msal';

export type B2CSignInParams = Omit<MSALInteractiveParams, 'authority'>;
export type B2CSilentParams = Pick<MSALSilentParams, 'scopes' | 'forceRefresh'>;
export type B2CSignOutParams = Pick<MSALSignoutParams, 'signoutFromBrowser' | 'webviewParameters'>;

export const config: B2CConfiguration = {
  auth: {
    clientId: '84771574-3cfe-442d-964f-c9fc3db201ce',
    // This authority is used as the default in `acquireToken` and `acquireTokenSilent` if not provided to those methods.
    // Defaults to 'https://login.microsoftonline.com/common'
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: Platform.select({
        ios: "msauth.com.lewissveritas.st1ckynotes://auth",
        android: "msauth://com.lewissveritas.st1ckynotes/XnpqLhDbpIT8JYmsymSwAWNlMj0%3D",
        web: "http://localhost:19006"
    }),
    scopes: [ 'https://graph.microsoft.com/User.Read', 'https://graph.microsoft.com/Mail.ReadWrite' ],
    appScopes: [ 'api://84771574-3cfe-442d-964f-c9fc3db201ce/Notes' ],
  },
  cache: {cacheLocation: 'localStorage'}
};

export type B2CConfiguration = Omit<MSALConfiguration, 'auth'> & {
    auth: {
      clientId: string;
      authority: string;
      redirectUri?: string;
      scopes: Array<string>;
      appScopes: Array<string>;
    };
  };

// Initialize the public client application:
export class B2CClient {
    private pca: PublicClientApplication;
    private scopes: Array<string>;
  
    /** Construct a B2CClient object
     * @param b2cConfig The configuration object for the B2CClient
     */
    constructor(b2cConfig: B2CConfiguration) {
      const { scopes, ...restOfAuthConfig } = b2cConfig.auth;
      this.scopes = scopes
  
      this.pca = new PublicClientApplication({
        ...b2cConfig,
        auth: { ...restOfAuthConfig },
      });
    }
  
    public async init() {
      if (Platform.OS === 'web') {
        sessionStorage.removeItem('msal.interaction.status');
      }
      await this.pca.init();
      console.log("PCA init finished");
      return this;
    }
  
    /** Initiates an interactive sign-in. If the user clicks "Forgot Password", and a reset password policy
     *  was provided to the client, it will initiate the password reset flow
     */
    public async signIn(params: B2CSignInParams): Promise<MSALResult> {
      console.log("PCA start signin")
      const isSignedIn = await this.isSignedIn();
      if (isSignedIn) {
        console.warn('A user is already signed in')
      }
  
      try {
        // If we don't provide an authority, the PCA will use the one we passed to it when we created it
        // (the sign in sign up policy)
        const result = await this.pca.acquireToken(params);
        if (!result) {
          throw new Error('Could not sign in: Result was undefined.');
        }
        console.log("PCA signin finished")
        return result;
      } catch (error: unknown) {
          throw error;
      }
    }
  
    /** Gets a token silently. Will only work if the user is already signed in */
    public async acquireTokenSilent(params: B2CSilentParams) {
      const account = await this.getAccountForPolicy();
      if (account) {
        // We provide the account that we got when we signed in, with the matching sign in sign up authority
        // Which again, we set as the default authority so we don't need to provide it explicitly.
        try {
          console.log('acquire token silent of scope: ' + params.scopes);
          const result = await this.pca.acquireTokenSilent({ ...params, account });
          if (!result) {
            throw new Error('Could not acquire token silently: Result was undefined.');
          }
          return result;
        } catch (error: unknown) {
            throw error;
        }
      } else {
        throw Error('Could not find existing account for sign in sign up policy');
      }
    }
  
    /** Returns true if a user is signed in, false if not */
    public async isSignedIn() {
      const signInAccount = await this.getAccountForPolicy();
      console.log('user claim: ' + signInAccount)
      return signInAccount !== undefined;
    }
  
    /** Removes all accounts from the device for this app. User will have to sign in again to get a token */
    public async signOut(params?: B2CSignOutParams) {
      const accounts = await this.pca.getAccounts();
      const signOutPromises = accounts.map((account) => this.pca.signOut({ ...params, account }));
      await Promise.all(signOutPromises);
      return true;
    }
  
    private async getAccountForPolicy(): Promise<MSALAccount | undefined> {
      const accounts = await this.pca.getAccounts();
      if (accounts == null || accounts!.length == 0) {
        return undefined;
      }
      console.log("account identify: " + accounts[0].identifier + ", claim: " + String(accounts[0].claims))
      return accounts.pop();
    }
}
