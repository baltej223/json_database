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

    create_database() {
        const databaseFolder = path.join(this.location, "database");
        try {
            // Ensure the entire directory path exists
            fs.mkdirSync(databaseFolder, { recursive: true });
            console.info(`Created directory at '${databaseFolder}'`);
        } catch (e) {
            throw new DatabaseError(`Error creating directory '${databaseFolder}': ${e}`);
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

    read_raw_database() {
        const databaseFolder = path.join(this.location, "database");
        const filePath = path.join(databaseFolder, this.name + ".json");
        try {
            return fs.readFileSync(filePath, "utf-8");
        } catch (e) {
            throw new DatabaseError(`Error reading database '${this.name}': ${e}`);
        }
    }

    read_database() {
        const content = this.read_raw_database();
        try {
            return JSON.parse(content);
        } catch (e) {
            throw new DatabaseError(`Error decoding JSON in database '${this.name}': ${e}`);
        }
    }

    insert_into(key, data) {
        const existingData = this.read_database();

        if (key in existingData) {
            console.warn(`Key '${key}' already exists in database '${this.name}'. Overwriting existing data.`);
        }

        existingData[key] = data;
        this.write_json(existingData);
        console.info(`Inserted data into '${key}' in database '${this.name}'.`);
    }

    delete_database() {
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

    delete_key(key) {
        const existingData = this.read_database();
        if (!(key in existingData)) {
            throw new Error(`Key '${key}' not found in the database '${this.name}'.`);
        }
        delete existingData[key];
        this.write_json(existingData);
        console.info(`Deleted key '${key}' from database '${this.name}'.`);
    }

    update(key, newData) {
        const existingData = this.read_database();

        if (!(key in existingData)) {
            throw new Error(`Key '${key}' not found in the database '${this.name}'.`);
        }

        if (typeof existingData[key] === 'object' && typeof newData === 'object') {
            existingData[key] = { ...existingData[key], ...newData };
        } else {
            existingData[key] = newData;
        }

        this.write_json(existingData);
        console.info(`Updated data for key '${key}' in database '${this.name}'.`);
    }

    write_json(data) {
        const databaseFolder = path.join(this.location, "database");
        const filePath = path.join(databaseFolder, this.name + ".json");
        try {
            jsonfile.writeFileSync(filePath, data, { spaces: 2 });
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

        const existing_data = this.read_database();
        const df = pd.DataFrame(existing_data);
        if (toshowORtoreturn === "show") {
            console.log(df);
        } else if (toshowORtoreturn === "return") {
            return df;
        }
    }
}

module.exports = JsonDatabase;