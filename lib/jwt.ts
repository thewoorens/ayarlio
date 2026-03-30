import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key'; // Ensure to set JWT_SECRET in production

export interface JwtPayload {
    userId: string;
    tokenVersion: number;
    tenantId?: string;
    role: string;
    [key: string]: any;
}

/**
 * Sign a new JWT token
 * @param payload Object containing user identifiers and roles
 * @param expiresIn Expiration time (default '1d')
 */
export const signToken = (payload: JwtPayload, expiresIn: SignOptions['expiresIn'] = '1d'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify checking a given JWT token
 * @param token The JWT token string
 * @returns Decoded JwtPayload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
