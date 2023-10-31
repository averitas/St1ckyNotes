import { ChatMessage, ChatResponse } from "../../types/general";
import { B2CClient, config } from "../msal";

export class ChatAppClient {
    private client: B2CClient = undefined;

    constructor(client: B2CClient) {
        this.client = client;
    }

    public async SendMessage(message: ChatMessage): Promise<ChatMessage> {
        try {
            const token = await this.client.acquireTokenSilent({ scopes: config.auth.appScopes });

            let newMessage = this.composeMessage(message);
            console.log('Sending ChatMessage of note id: ' + message.noteId);
            const resp = await fetch('https://openaiproxybackendapp.azurewebsites.net/api/azopenaitrigger', {
              mode: 'cors',
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + token.accessToken,
                'x-functions-key': 'hvkcgCOxK7XIOoin9eMawWofjLoJ7_saeAmuIxrkp9qtAzFue-2tIA==',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-functions-key',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
              },
              body: JSON.stringify(newMessage),
            });
            if (resp.status !== 200) {
                throw new Error("Send message failed with status code: " + resp.status);
            }
            let bodyEntity: ChatResponse = await resp.json();
            console.log("[ChatAppClient] SendMessage receive reply: " + bodyEntity.message);

            return {
                noteId: message.noteId,
                sessionId: bodyEntity.data.sessionId,
                promo: message.promo,
                reply: bodyEntity.message,
                type: message.type,
                context: [...bodyEntity.data.context],
            } as ChatMessage;
        } catch (error) {
            console.warn(error);
            return {
                noteId: message.noteId,
                sessionId: '',
                promo: message.promo,
                reply: 'Request failed with response: ' + String(error),
                type: message.type,
                context: [],
            } as ChatMessage
        }
    }

    private composeMessage(message: ChatMessage): ChatMessage {
        let res: ChatMessage = {
            noteId: message.noteId,
            sessionId: message.sessionId,
            promo: message.promo,
            reply: message.reply,
            type: message.type,
            context: message.context,
        } as ChatMessage;

        console.log('Cmp Input Chat message is ' + JSON.stringify(res.context));
        if (!message.context || message.context.length === 0) {
            res.context = [{role: "system", content: "The message the user sent to you is in HTML format. " + 
                    "The reply from you should be in HTML format as well. DO NOT reply anything other than the HTML content."}];
        }
        switch (message.type) {
            case "Butify":
                res.context.push({role: "system", content: "Now user will send a sticky note to you. Its format is HTML. Complete and buitify it with" +
                        " expanded information and reply to me with only the HTML content."});
                break;
            case "Summary":
                res.context.push({role: "system", content: "Now user will send a sticky note to you. Its format is HTML. Complete and summarize it based on" +
                        " the original information and reply to me with only the HTML content."});
                break;
            default:
                break;
        }

        return res;
    }
}
