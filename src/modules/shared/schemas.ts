import { z } from "zod";

import { currencyValues } from "@/domain/types/money";

export const currencySchema = z.enum(currencyValues);

export const yearSchema = z.number().int().min(1970).max(2200);
export const monthSchema = z.number().int().min(1).max(12);
