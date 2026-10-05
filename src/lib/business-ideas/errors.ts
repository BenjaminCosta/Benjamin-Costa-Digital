import "server-only";
import type { IdeasErrorCode } from "@/types/business-ideas";

export class IdeasError extends Error {
  constructor(readonly code: IdeasErrorCode, message: string, readonly httpStatus = 400) {
    super(message);
    this.name = "IdeasError";
  }
}
