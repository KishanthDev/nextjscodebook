import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

type StatValue = [number, number];

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

async function getSetting<T>(db: any, name: string, defaultValue: T): Promise<T> {
    const settings = db.collection("settings");
    const doc = await settings.findOne({ name });
    if (!doc || !doc.value) return defaultValue;
    try {
        return typeof doc.value === "string" ? JSON.parse(doc.value) : doc.value;
    } catch {
        return doc.value;
    }
}

function isFileSource(url: string): boolean {
    const ext = url.slice(-4).toLowerCase();
    return ext === ".pdf" || ext === ".txt";
}

function isCloud(): boolean {
    return false;
}

function cloudLimit(): number {
    return 1_000_000;
}

export async function GET() {
    try {
        await client.connect();
        const db = client.db("zotly_sb");

        const information: Record<string, StatValue | number | false> = {
            limit: false,
            files: [0, 0],
            website: [0, 0],
            qea: [0, 0],
            flows: [0, 0],
            articles: [0, 0],
            conversations: [0, 0],
        };

        // Load all data in parallel
        const [
            sources,
            qeaDocs,
            articlesDocs,
            flowsDocs,
            convSetting
        ] = await Promise.all([
            getSetting<Record<string, string[]>>(db, "embedding-sources", {}),
            db.collection("qea_embeddings").find({}).toArray(),
            db.collection("articles").find({}).toArray(),
            db.collection("flows").find({}).toArray(),
            getSetting<string>(db, "open-ai-embeddings-conversations", "0|0")
        ]);

        let total = 0;

        // QEA processing
        const qeaTextLen = qeaDocs.reduce((acc, doc) => {
            const combined = [doc.question, doc.answer].filter(Boolean).join(" ");
            return acc + combined.length;
        }, 0);
        information["qea"] = [qeaTextLen, qeaDocs.length];
        total += qeaTextLen;

        // Articles
        information["articles"] = [0, articlesDocs.length];

        // Flows
        information["flows"] = [0, flowsDocs.length];

        // Conversations
        const parts = convSetting.split("|");
        const convCount = parts.length > 1 ? parseInt(parts[1]) : 0;
        information["conversations"] = [0, convCount];

        // Handle file + website embeddings
        for (const key in sources) {
            const embeddings = sources[key];
            const keyInfo =
                key === "sb-database"
                    ? "qea"
                    : key === "sb-conversations"
                        ? "conversations"
                        : key === "sb-articles"
                            ? "articles"
                            : key === "sb-flows"
                                ? "flows"
                                : isFileSource(key)
                                    ? "files"
                                    : "website";

            if (["files", "website"].includes(keyInfo)) {
                (information[keyInfo] as StatValue)[1] += embeddings.length;

                // Fetch all file data in parallel
                const fileDataList = await Promise.all(
                    embeddings.map(id =>
                        db.collection("embeddings").find({ embedding_id: id }).toArray()
                    )
                );

                for (const fileData of fileDataList) {
                    const textLen = fileData.reduce((acc, item) => acc + (item.text ? item.text.length : 0), 0);
                    (information[keyInfo] as StatValue)[0] += textLen;
                    total += textLen;
                }
            }
        }

        information["total"] = total;
        if (isCloud()) {
            information["limit"] = cloudLimit();
        }

        return NextResponse.json(information);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data", details: error }, { status: 500 });
    } finally {
        await client.close();
    }
}
