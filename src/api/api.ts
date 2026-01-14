import { serverApiInstance } from "./axiosInstance";

export type Message = {
    created_at:         string;
    id:                 string;
    sender_id:          string;
    content:            string;
    is_read:            boolean;
    conversation_id:    string;
}

export type ConversationWithUser = {
    user_data: { 
        id : string;
        last_seen: string;
        username: string;
        conversation_id: string
    };
    is_online: boolean;
}

export type LoginResposne = {
    access_token: string;
    user: {
        created_at: string;
        email: string;
        id: string;
        last_seen: string;
        username: string
    }
}

export const createAccessToken = ({ email, password } : { email : string, password: string }) => {
    return serverApiInstance.post<LoginResposne>('/auth/token', { email, password })
}

export const getMessageHistory = ({ token, with_id } : {token: string, with_id:string}) => {
    return serverApiInstance.get<Message[]>(`authenticated/messages?with_id=${with_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const getConversations = ({ token }: {token : string}) => {
    return serverApiInstance.get<ConversationWithUser[]>('/authenticated/conversations/mine', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}