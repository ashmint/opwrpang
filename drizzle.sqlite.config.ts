import { APP_PATH } from "@server/lib/consts";
import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
    dialect: "sqlite",
    schema: path.join("server", "db", "sqlite", "schema.ts"),
    out: path.join("server", "migrations"),
    verbose: true,
    dbCredentials: {
        url: path.join(APP_PATH, "db", "db.sqlite")
    }
});
