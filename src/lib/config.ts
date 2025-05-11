import { v4 as uuid } from "uuid";

export const JWT_SECRET = process.env.JWT_SECRET || uuid();
