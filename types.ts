
export enum AppMode {
    Chat = 'chat',
    Image = 'image',
    Complex = 'complex',
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    sources?: GroundingSource[];
}
