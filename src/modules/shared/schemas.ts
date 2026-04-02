import { z } from "zod";

import { currencyValues } from "@/domain/types/money";
import { getMaxSupportedYear, getMinSupportedYear } from "@/lib/date/year-bounds";

export const currencySchema = z.enum(currencyValues);

const minSupportedYear = getMinSupportedYear();
const maxSupportedYear = getMaxSupportedYear();

export const yearSchema = z.number().int().min(minSupportedYear).max(maxSupportedYear);
export const monthSchema = z.number().int().min(1).max(12);
