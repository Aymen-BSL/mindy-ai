import sqlite3

def create_db():
    # Connect to the database (or create it if it doesn't exist)
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    # Create the chat_sessions table if it doesn't exist
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            user_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age TEXT,
            conversation_time TEXT,
            chat_prompt TEXT,
            messages TEXT,
            report TEXT
        )
    """)

    # Save changes and close the connection
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_db()
    print("Database created successfully.")
