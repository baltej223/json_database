import os
import json
import logging
import pip
#import pandas as pd

logging.basicConfig(level=logging.INFO)


class DatabaseError(Exception):
    pass

class JsonDatabase:
    def __init__(self, location=".", name="default"):
        self.location = location
        self.name = name

    def create_database(self):
        """Create a new JSON database file if it doesn't exist."""
        database_folder = os.path.join(self.location, "database")
        if not os.path.exists(database_folder):
            os.makedirs(database_folder)
        path = os.path.join(database_folder, self.name + '.json')
        if not os.path.exists(path):
            try:
                with open(path, 'w') as file:
                    file.write("{\n\n}")
                logging.info(f"Created database '{self.name}' at '{path}'.")
            except IOError as e:
                raise DatabaseError(f"Error creating database '{self.name}': {e}")
        else:
            logging.warning(f"Database '{self.name}' already exists at '{path}'.")

    def read_raw_database(self):
        """Read raw content from a JSON database file."""
        database_folder = os.path.join(self.location, "database")
        path = os.path.join(database_folder, self.name + '.json')
        try:
            with open(path, "r") as file:
                content = file.read()
            return content
        except IOError as e:
            raise DatabaseError(f"Error reading database '{self.name}': {e}")

    def read_database(self):
        """Read JSON content from a database file."""
        content = self.read_raw_database()
        try:
            JSONContent = json.loads(content)
            return JSONContent # returns Python dict
        except json.JSONDecodeError as e:
            raise DatabaseError(f"Error decoding JSON in database '{self.name}': {e}")
    
    def insert_into(self, key, data):
        """Insert data into a JSON database."""
        database_folder = os.path.join(self.location, "database")
        existing_data = self.read_database()
    
        # Check if the key already exists in the database
        if key in existing_data:
            logging.warning(f"Key '{key}' already exists in database '{self.name}'. Overwriting existing data.")
    
        # Update the database with the new data
        existing_data[key] = data
    
        # Write the updated data to the database file
        self.write_json(existing_data)
        logging.info(f"Inserted data into '{key}' in database '{self.name}'.")

    def delete_database(self):
        """Delete the JSON database file."""
        database_folder = os.path.join(self.location, "database")
        path = os.path.join(database_folder, self.name + '.json')
        try:
            os.remove(path)
            logging.info(f"Deleted database '{self.name}'.")
        except FileNotFoundError:
            logging.warning(f"Database '{self.name}' does not exist.")
        except IOError as e:
            raise DatabaseError(f"Error deleting database '{self.name}': {e}")

    def delete_key(self, key):
        """Delete a key from a JSON database."""
        database_folder = os.path.join(self.location, "database")
        existing_data = self.read_database()
        if key not in existing_data:
            raise KeyError(f"Key '{key}' not found in the database '{self.name}'.")
        existing_data.pop(key)
        # Write the updated data to the database file
        self.write_json(existing_data)
        logging.info(f"Deleted key '{key}' from database '{self.name}'.")

    def update(self, key, new_data):
        """Update data associated with a key in a JSON database."""
        database_folder = os.path.join(self.location, "database")
        existing_data = self.read_database()
    
        # Check if the key exists in the database
        if key not in existing_data:
            raise KeyError(f"Key '{key}' not found in the database '{self.name}'.")
    
        # Update the existing data with new_data
        if isinstance(existing_data[key], dict) and isinstance(new_data, dict):
            existing_data[key].update(new_data)
        else:
            existing_data[key] = new_data
    
        # Write the updated data to the database file
        self.write_json(existing_data)
        logging.info(f"Updated data for key '{key}' in database '{self.name}'.")

    def write_json(self, python_dict):
        """Write data to a JSON database file."""
        database_folder = os.path.join(self.location, "database")
        path = os.path.join(database_folder, self.name + '.json')
        try:
            with open(path, "w") as file:
                json.dump(python_dict, file)
            #logging.info(f"Updated database '{self.name}'")
        except IOError as e:
            raise DatabaseError(f"Error writing at database '{self.name}': {e}")

    def show(self,toshowORtoreturn="show"):
        """Show database content in tabular form."""
        try:
            import pandas as pd  
        except ImportError:
            pd = None
            logging.warning("Pandas is not installed. For running this command pandas is required. Please install it by 'pip install pandas' or 'py -m pip install pandas'")
            inp = input("Write y/n if want to install/not install pandas")
            if (inp == "y"):
                pip.main(['install', 'pandas'])
            elif (inp == "n"):
                pass
            else:
                logging.error("No valid option selected")
        existing_data = self.read_database()
        df = pd.DataFrame.from_dict(existing_data, orient='index')
        if (toshowORtoreturn == "show"):
            print(df)
        elif(toshowORtoreturn == "return"):
            return df
