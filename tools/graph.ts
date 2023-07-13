// Copyright (c) Microsoft.
// Licensed under the MIT license.

import {Client} from '@microsoft/microsoft-graph-client';
import { RemoteNote } from '../types/note';

export async function GetMeNotes(token: string) {
    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          return token;
        }
      },
    });

    const notes: RemoteNote[] = (await graphClient
        .api('me/MailFolders/notes/messages')
        .get()).value;
    
    console.log("GetMeNotes get response: " + notes);
    return notes;
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
