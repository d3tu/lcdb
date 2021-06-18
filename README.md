# lcdb
A simple local database using the Node.js file system module.

```js
const db = require("lcdb")(
  "path", // Example: db or dbs/db.
  { replacer: null, space: 2, path: "optional" } // For JSON.stringify. (Optional)
);

// Use / to reference notation.

db.set("ref", "data");
db.get("ref or /");
db.delete("ref or /");
db.stats();
db.all();
db.clear();
db.add("ref", 123);
db.subtract("ref", 123);
db.push("ref", "value or ...values");
db.shift("ref");
db.pop("ref"):
db.splice("ref", ...args);
db.type("ref");
db.entries("ref or /");
db.keys("ref or /");
db.values("ref or /");
```