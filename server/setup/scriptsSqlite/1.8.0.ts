import { APP_PATH } from "@server/lib/consts";
import Database from "better-sqlite3";
import path from "path";

const version = "1.8.0";

export default async function migration() {
    console.log(`Running setup script ${version}...`);

    const location = path.join(APP_PATH, "db", "db.sqlite");
    const db = new Database(location);

    try {
        const addedColumns: string[] = [];

        db.transaction(() => {
            if (!columnExists(db, "resources", "enableProxy")) {
                db.exec(
                    `ALTER TABLE 'resources' ADD 'enableProxy' integer DEFAULT 1;`
                );
                addedColumns.push("resources.enableProxy");
            }

            if (!columnExists(db, "sites", "remoteSubnets")) {
                db.exec(`ALTER TABLE 'sites' ADD 'remoteSubnets' text;`);
                addedColumns.push("sites.remoteSubnets");
            }

            if (!columnExists(db, "user", "termsAcceptedTimestamp")) {
                db.exec(
                    `ALTER TABLE 'user' ADD 'termsAcceptedTimestamp' text;`
                );
                addedColumns.push("user.termsAcceptedTimestamp");
            }

            if (!columnExists(db, "user", "termsVersion")) {
                db.exec(`ALTER TABLE 'user' ADD 'termsVersion' text;`);
                addedColumns.push("user.termsVersion");
            }
        })();

        if (addedColumns.length === 0) {
            console.log(
                "Skipped database schema migration; all columns already exist"
            );
        } else {
            console.log(
                `Migrated database schema (added: ${addedColumns.join(", ")})`
            );
        }
    } catch (e) {
        console.log("Unable to migrate database schema");
        throw e;
    }

    console.log(`${version} migration complete`);
}

function columnExists(
    db: InstanceType<typeof Database>,
    table: string,
    column: string
): boolean {
    const stmt = db.prepare(
        `SELECT name FROM pragma_table_info('${table.replace(/'/g, "''")}') WHERE name = ?`
    );
    return Boolean(stmt.get(column));
}
