import { db } from "../../db/sqlite";
import { sql } from "drizzle-orm";

const version = "1.1.0";

export default async function migration() {
    console.log(`Running setup script ${version}...`);

    try {
        db.transaction((trx) => {
            trx.run(sql`CREATE TABLE 'supporterKey' (
	'keyId' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	'key' text NOT NULL,
	'githubUsername' text NOT NULL,
	'phrase' text,
	'tier' text,
	'valid' integer DEFAULT false NOT NULL
);`);
        });

        console.log(`Migrated database schema`);
    } catch (e) {
        console.log("Unable to migrate database schema");
        throw e;
    }

    console.log(`${version} migration complete`);
}
