export interface JwtPayload {
    email: string;
}

export interface RequestWithUser extends Request {
    user: JwtPayload;
}