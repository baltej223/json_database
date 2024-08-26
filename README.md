# Json Database Management

`JsonDatabase` is a lightweight JSON database management system written in Python. It treats json files as database files. It provides a simple way to create, read, update, and delete JSON databases. It also helps to visualise data using python library `pandas`

## Features

- **Create** a new JSON database file.
- **Read** raw and parsed JSON data from the database file.
- **Insert** new data into the database.
- **Delete** the entire database or specific keys.
- **Update** existing data.
- **Show** database content in a tabular format using Pandas (optional).

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

## Edge Cases

1. **Database File Already Exists**: If you attempt to create a database that already exists, a warning will be logged.
2. **Invalid JSON Format**: If the JSON content is invalid, a `DatabaseError` will be raised.
3. **Key Not Found**: Attempting to delete or update a key that does not exist will raise a `KeyError`.
4. **Pandas Not Installed**: If Pandas is not installed and you try to use the `show` method, you will be prompted to install it.

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

## Troubleshooting

- **File Permission Issues**: Ensure that the directory where the database is being created has the appropriate permissions.
- **Invalid JSON**: Make sure the data being inserted is valid JSON.

For further assistance or to report issues, please open an issue on the [GitHub repository](https://github.com/baltej223/json_database).

---

Feel free to customize this it as needed for your specific use case or project requirements!
