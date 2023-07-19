// Copyright (c) Microsoft.
// Licensed under the MIT license.

import {Client} from '@microsoft/microsoft-graph-client';
import { RemoteNote } from '../../types/note';
import { NotesManager } from './notesManager';

interface fetchResponse {
    "@odata.nextLink": string,
    "@odata.context": string,
    value: RemoteNote[]
}

export class GraphNotesManager implements NotesManager {
    private graphClient: Client;
    private token: string;

    constructor(token: string) {
        this.graphClient = Client.initWithMiddleware({
            authProvider: {
              getAccessToken: async () => {
                return token;
              }
            },
        });
        this.token = token;
    }

    public async GetMeNotes(): Promise<RemoteNote[]> {
        var resp: fetchResponse = await this.graphClient
            .api('me/MailFolders/notes/messages')
            .get();
        var rawNotes: RemoteNote[] = resp.value;
        
        while (resp['@odata.nextLink']) {
            resp = await fetch(resp['@odata.nextLink'], {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json', 
                    'Authorization': 'Bearer ' + this.token}
              })
              .then(response => response.json());
            rawNotes.push(...resp.value);
            console.log("GetMeNotes for loop get response: " + resp);
        }
    
        return rawNotes;
    }

    public async UpdateMeNotes(note: RemoteNote): Promise<RemoteNote> {
        const resp: RemoteNote = await this.graphClient
            .api('me/MailFolders/notes/messages/' + note.id)
            .patch(note);
        console.log("UpdateMeNotes response: " + resp);
        return resp;
    }

    public async CreateMeNotes(note: RemoteNote): Promise<RemoteNote> {
        const resp: RemoteNote = await this.graphClient
            .api('me/MailFolders/notes/messages')
            .post(note);
        console.log("CreateMeNotes response: " + resp);
        return resp;
    }

    public async DeleteMeNotes(noteId: string) {
        const resp = await this.graphClient
            .api('me/MailFolders/notes/messages/' + noteId)
            .delete();
        console.log("DeleteMeNotes response: " + resp);
        return resp;
    }
}
