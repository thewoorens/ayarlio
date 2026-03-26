import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./db";
import logger from "./logger";
import { verifyToken, JwtPayload } from "./jwt";
import { Role, hasPermission } from "./permissions";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

interface HandlerContext {
  params: Record<string, string>;
}

type APIHandler = (
  req: NextRequest,
  ctx: HandlerContext,
  user?: JwtPayload,
) => Promise<NextResponse>;

interface HandlerOptions {
  requireAuth?: boolean;
  requiredRole?: Role;
}

export function apiHandler(handler: APIHandler, options?: HandlerOptions) {
  return async (req: NextRequest, ctx: HandlerContext) => {
    try {
      await dbConnect();

      let user: JwtPayload | undefined = undefined;

      if (options?.requireAuth) {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new APIError(
            401,
            "Unauthorized: Missing or invalid token format",
          );
        }

        const token = authHeader.split(" ")[1];

        try {
          user = verifyToken(token);
        } catch (err: any) {
          throw new APIError(401, "Unauthorized: Token is invalid or expired");
        }

        if (options.requiredRole && user?.role) {
          if (!hasPermission(user.role, options.requiredRole)) {
            throw new APIError(403, "Forbidden: Insufficient role permissions");
          }
        }
      }

      return await handler(req, ctx, user);
    } catch (error: any) {
      logger.error(`API Route Error [${req.method} ${req.nextUrl.pathname}]`, {
        errorMessage: error.message,
        stack: error.stack,
      });

      if (error instanceof APIError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Validation Error", details: error.message },
          { status: 400 },
        );
      }

      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Invalid payload structure", details: error.errors },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
