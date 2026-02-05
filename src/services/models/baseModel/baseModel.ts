import { z } from "zod";

export type BaseModel<T> = {
  success?: boolean;
  result?: T;
  error_message: string;
  error_detail: string;
  status_code: number;
  unAuthorizedRequest?: boolean;
};

export type ErrorBaseModel = {
  code?: number;
  message?: string;
  details?: null;
  validationErrors?: null;
};

export const BaseModelSchema = z.object({
  result: z.any().optional(),
  success: z.boolean().optional(),
  error: z.null().optional(),
  unAuthorizedRequest: z.boolean().optional(),
});
