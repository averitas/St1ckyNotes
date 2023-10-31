// Type: Interface
interface ErrorMessage {
    id: string;
    index: number;
    message: string;
}

enum ChatType {
    Butify = "Butify",
    Summary = "Summary",
}

interface Response {
    code: number;
    message: string;
    data: any;
}

interface ChatResponse extends Response {
    data: ChatMessage;
}

interface ChatMessage {
    noteId: string;
    sessionId: string;
    promo: string;
    reply: string;
    type: ChatType;
    context: Chat[];
}

interface Chat {
    role: string; // "user" or "system"
    content: string;
}

export { ErrorMessage, ChatType, ChatMessage, Chat, Response, ChatResponse };
