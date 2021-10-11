export interface User {
    email: string;
    password: string;
}

export interface UserResponse{//se tienen que llamar igual a lo que manda
    msg :string;
    token: string;
    userId: number;
    username:string;
}