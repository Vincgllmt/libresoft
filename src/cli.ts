import { SoftwareSchema } from "./software/software.collection";

let cmd = 'show-invalid-documents';

if (process.argv.length > 2)
    cmd = process.argv[2];

let promise = null;

switch (cmd) {
    default:
        promise = SoftwareSchema.showInvalidDocuments();
        break;
}

promise.then(() => process.exit());