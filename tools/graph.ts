// Copyright (c) Microsoft.
// Licensed under the MIT license.

import {Client} from '@microsoft/microsoft-graph-client';
import { RemoteNote } from '../types/note';

interface fetchResponse {
    "@odata.nextLink": string,
    "@odata.context": string,
    value: RemoteNote[]
}

export async function GetMeNotes(token: string): Promise<RemoteNote[]> {
    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          return token;
        }
      },
    });

    var resp: fetchResponse = await graphClient
        .api('me/MailFolders/notes/messages')
        .get();
    var rawNotes: RemoteNote[] = resp.value;
    
    while (resp['@odata.nextLink']) {
        resp = await fetch(resp['@odata.nextLink'], {
            method: 'GET',
            headers: {
                'Content-Type':'application/json', 
                'Authorization': 'Bearer ' + token}
          })
          .then(response => response.json());
        rawNotes.push(...resp.value);
        console.log("GetMeNotes for loop get response: " + resp);
    }

    return rawNotes;
}

export async function UpdateMeNotes(token: string, note: RemoteNote) {
    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          return token;
        }
      },
    });

    const resp = await graphClient
        .api('me/MailFolders/notes/messages/' + note.id)
        .patch(note);
    
    console.log("UpdateMeNotes get response: " + resp);
    return resp;
}

export async function CreateMeNotes(token: string, note: RemoteNote) {
    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          return token;
        }
      },
    });

    const resp = await graphClient
        .api('me/MailFolders/notes/messages/')
        .post(note);

    console.log("CreateMeNotes get response: " + resp);
    return resp;
}

export async function DeleteMeNotes(token: string, noteId: string) {
    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          return token;
        }
      },
    });

    const resp = await graphClient
        .api('me/MailFolders/notes/messages/' + noteId)
        .delete();

    console.log("DeleteMeNotes get response: " + resp);
    return resp;
}
