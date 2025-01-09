# Json Database Management

`JsonDatabase` is a lightweight JSON database management system written in Python and nodejs. It treats json files as database files. It provides a simple way to create, read, update, and delete JSON databases. It also helps to visualise data pandas (python) or pandas-js for node-js

## Features

- **Create** a new JSON database file.
- **Read** raw and parsed JSON data from the database file.
- **Insert** new data into the database.
- **Delete** the entire database or specific keys.
- **Update** existing data.
- **Show** database content in a tabular format using Pandas (optional).

# For Python:
## Installation

Ensure you have Python installed. If you plan to use the `show` method with Pandas, install Pandas as well:

```bash
pip install pandas # optional as it it only needed when to visualise data
```

## Usage

### Creating a Database

To create a new JSON database file:

```python
from json_database import JsonDatabase
# OR
from json_database import *


db = JsonDatabase(location=".", name="my_database")
db.create_database()
```

### Reading the Database

To read the raw content of the database:

```python
content = db.read_raw_database() # will return content of json database as a string
print(content)
```

To read and parse the JSON content:

```python
data = db.read_database() # will return content of json database as a python dictionary
print(data)
```

### Inserting Data

To insert or update data in the database:

```python
db.insert_into(key="user1", data={"name": "Alice", "age": 30})
```
- If you create a fresh database and run above code, that database is going to look like this
```
{
"user1":{
  "name": "Alice",
   "age": 30
  },
}
```
### Deleting Data

To delete the entire database file:

```python
db.delete_database()
```

To delete a specific key from the database:

```python
db.delete_key("user1")
```

### Updating Data

To update existing data:

```python
db.update(key="user1", new_data={"age": 31})
```

### Showing Data in Tabular Form

To display the database content as a Pandas DataFrame:

```python
db.show(toshowORtoreturn="show")  # To print the DataFrame
```

To return the DataFrame object:

```python
df = db.show(toshowORtoreturn="return")
print(df)
```

## Error Handling

- **DatabaseError**: Raised for errors related to database operations (e.g., file creation, reading, writing, etc.).
- **KeyError**: Raised when trying to delete or update a non-existent key.

## Example

Here's a complete example demonstrating the it:

```python
from json_database import JsonDatabase

# Create a database
db = JsonDatabase(location=".", name="example_db")
db.create_database()

# Insert data
db.insert_into("user1", {"name": "Alice", "age": 30})

# Read data
data = db.read_database()
print("Data:", data)

# Update data
db.update("user1", {"age": 31})

# Show data
db.show(toshowORtoreturn="show")

# Delete key
db.delete_key("user1")

# Delete database
db.delete_database()
```

# For Node js:
Here is the documentation for the `JsonDatabase` class:

## JsonDatabase Class

### Description

`JsonDatabase` is a class that provides methods to interact with a JSON-based database stored in a file. The database is created, read, updated, and deleted using the provided methods. Each database is a JSON file stored in a specified directory.

### Constructor

```javascript
constructor(location = ".", name = "default")
```

- `location`: The directory where the database will be stored. Default is the current directory.
- `name`: The name of the database (without the `.json` extension). Default is "default".

### Methods

#### create_database

```javascript
create_database()
```

Creates the database file and its directory if they do not exist.

**Example:**

```javascript
const db = new JsonDatabase();
db.create_database();
```

**Edge Cases:**
- If the database file already exists, a warning message will be logged.

#### read_raw_database

```javascript
read_raw_database()
```

Reads the raw content of the database file as a string.

**Example:**

```javascript
const rawContent = db.read_raw_database();
console.log(rawContent);
```

**Edge Cases:**
- If the database file does not exist, a `DatabaseError` is thrown.

#### read_database

```javascript
read_database()
```

Reads and parses the content of the database file as a JSON object.

**Example:**

```javascript
const data = db.read_database();
console.log(data);
```

**Edge Cases:**
- If the database file does not exist, a `DatabaseError` is thrown.
- If the JSON content is invalid, a `DatabaseError` is thrown.

#### insert_into

```javascript
insert_into(key, data)
```

Inserts data into the database under the specified key.

- `key`: The key under which data will be stored.
- `data`: The data to be stored.

**Example:**

```javascript
db.insert_into("user1", { name: "John Doe", age: 30 });
```

**Edge Cases:**
- If the key already exists, a warning message will be logged and the existing data will be overwritten.

#### delete_database

```javascript
delete_database()
```

Deletes the database file.

**Example:**

```javascript
db.delete_database();
```

**Edge Cases:**
- If the database file does not exist, a warning message will be logged.

#### delete_key

```javascript
delete_key(key)
```

Deletes the data associated with the specified key from the database.

- `key`: The key to be deleted.

**Example:**

```javascript
db.delete_key("user1");
```

**Edge Cases:**
- If the key does not exist, an error is thrown.

#### update

```javascript
update(key, newData)
```

Updates the data associated with the specified key.

- `key`: The key to be updated.
- `newData`: The new data to be merged with the existing data.

**Example:**

```javascript
db.update("user1", { age: 31 });
```

**Edge Cases:**
- If the key does not exist, an error is thrown.
- If the existing data and new data are both objects, they will be merged. Otherwise, the new data will overwrite the existing data.

#### write_json

```javascript
write_json(data)
```

Writes the given JSON object to the database file.

- `data`: The JSON object to be written.

**Example:**

```javascript
db.write_json({ user1: { name: "John Doe", age: 30 } });
```

**Edge Cases:**
- If there is an error writing to the file, a `DatabaseError` is thrown.

#### show

```javascript
async show(toshowORtoreturn = "show")
```

Displays or returns the database content as a tabular data frame. Requires `pandas-js` to be installed.

- `toshowORtoreturn`: If "show", logs the data frame to the console. If "return", returns the data frame.

**Example:**

```javascript
db.show();
```

**Edge Cases:**
- If `pandas-js` is not installed, prompts the user to install it. If the user declines, the function exits.

### Error Handling

The `DatabaseError` class is used to handle errors related to database operations.

```javascript
class DatabaseError extends Error {}
```

### Example Usage

```javascript
const JsonDatabase = require('./JsonDatabase.js'); //Assuming you JsonDatabase.js file is in the same directory in which nodejs in running

// Initialize the database
const db = new JsonDatabase('.', 'exampleDB');
db.create_database();

// Insert data
db.insert_into('user1', { name: 'John Doe', age: 30 });

// Read data
const data = db.read_database();
console.log(data);

// Update data
db.update('user1', { age: 31 });

// Show data
db.show();

// Delete a key
db.delete_key('user1');

// Delete the database
db.delete_database();
```

## Edge Cases

1. **Database File Already Exists**: If you attempt to create a database that already exists, a warning will be logged.
2. **Invalid JSON Format**: If the JSON content is invalid, a `DatabaseError` will be raised.
3. **Key Not Found**: Attempting to delete or update a key that does not exist will raise a `KeyError`.
4. **Pandas Not Installed**: If Pandas is not installed and you try to use the `show` method, you will be prompted to install it.

## Troubleshooting

- **File Permission Issues**: Ensure that the directory where the database is being created has the appropriate permissions.
- **Invalid JSON**: Make sure the data being inserted is valid JSON.

For further assistance or to report issues, please open an issue on the [GitHub repository](https://github.com/baltej223/json_database).

---

Feel free to customize this it as needed for your specific use case or project requirements!
