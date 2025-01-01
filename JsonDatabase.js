const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const readline = require('readline');

class DatabaseError extends Error {}

class JsonDatabase {
    constructor(location = ".", name = "default") {
        this.location = location;
        this.name = name;
    }

    createDatabase() {
        const databaseFolder = path.join(this.location, "database");
        if (!fs.existsSync(databaseFolder)) {
            fs.mkdirSync(databaseFolder);
        }
        const filePath = path.join(databaseFolder, this.name + ".json");
        if (!fs.existsSync(filePath)) {
            try {
                fs.writeFileSync(filePath, "{\n\n}");
                console.info(`Created database '${this.name}' at '${filePath}'.`);
            } catch (e) {
                throw new DatabaseError(`Error creating database '${this.name}': ${e}`);
            }
        } else {
            console.warn(`Database '${this.name}' already exists at '${filePath}'.`);
        }
    }

    readRawDatabase() {
        const databaseFolder = path.join(this.location, "database");
        const filePath = path.join(databaseFolder, this.name + ".json");
        try {
            return fs.readFileSync(filePath, "utf-8");
        } catch (e) {
            throw new DatabaseError(`Error reading database '${this.name}': ${e}`);
        }
    }

    readDatabase() {
        const content = this.readRawDatabase();
        try {
            return JSON.parse(content);
        } catch (e) {
            throw new DatabaseError(`Error decoding JSON in database '${this.name}': ${e}`);
        }
    }

    insertInto(key, data) {
        const existingData = this.readDatabase();

        if (key in existingData) {
            console.warn(`Key '${key}' already exists in database '${this.name}'. Overwriting existing data.`);
        }

        existingData[key] = data;
        this.writeJson(existingData);
        console.info(`Inserted data into '${key}' in database '${this.name}'.`);
    }

    deleteDatabase() {
        const databaseFolder = path.join(this.location, "database");
        const filePath = path.join(databaseFolder, this.name + ".json");
        try {
            fs.unlinkSync(filePath);
            console.info(`Deleted database '${this.name}'.`);
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.warn(`Database '${this.name}' does not exist.`);
            } else {
                throw new DatabaseError(`Error deleting database '${this.name}': ${e}`);
            }
        }
    }

    deleteKey(key) {
        const existingData = this.readDatabase();
        if (!(key in existingData)) {
            throw new Error(`Key '${key}' not found in the database '${this.name}'.`);
        }
        delete existingData[key];
        this.writeJson(existingData);
        console.info(`Deleted key '${key}' from database '${this.name}'.`);
    }

    update(key, newData) {
        const existingData = this.readDatabase();

        if (!(key in existingData)) {
            throw new Error(`Key '${key}' not found in the database '${this.name}'.`);
        }

        if (typeof existingData[key] === 'object' && typeof newData === 'object') {
            existingData[key] = { ...existingData[key], ...newData };
        } else {
            existingData[key] = newData;
        }

        this.writeJson(existingData);
        console.info(`Updated data for key '${key}' in database '${this.name}'.`);
    }

    writeJson(pythonDict) {
        const databaseFolder = path.join(this.location, "database");
        const filePath = path.join(databaseFolder, this.name + ".json");
        try {
            jsonfile.writeFileSync(filePath, pythonDict, { spaces: 2 });
        } catch (e) {
            throw new DatabaseError(`Error writing at database '${this.name}': ${e}`);
        }
    }

    async show(toshowORtoreturn = "show") {
        let pd;
        try {
            pd = require('pandas-js');  // Note: pandas-js is a placeholder for actual tabular data handling in JS
        } catch (e) {
            console.warn("Pandas is not installed. For running this command pandas is required. Please install it by 'npm install pandas-js'");
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise(resolve => rl.question("Write y/n if want to install/not install pandas: ", resolve));
            rl.close();
            if (answer.toLowerCase() === 'y') {
                require('child_process').execSync('npm install pandas-js');
                pd = require('pandas-js');
            } else if (answer.toLowerCase() === 'n') {
                return;
            } else {
                console.error("No valid option selected");
                return;
            }
        }

        const existingData = this.readDatabase();
        const df = pd.DataFrame(existingData);
        if (toshowORtoreturn === "show") {
            console.log(df);
        } else if (toshowORtoreturn === "return") {
            return df;
        }
    }
}

// Example usage
const db = new JsonDatabase(".", "example");
db.createDatabase();
db.insertInto("key1", { field1: "value1" });
console.log(db.readDatabase());
db.deleteKey("key1");
db.deleteDatabase();
