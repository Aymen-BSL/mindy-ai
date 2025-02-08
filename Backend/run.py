from flask import Flask, json, request, jsonify
import dotenv
from llm_utils import call_llm
from prompts import get_chat_prompt, get_report_prompt
import sqlite3 as sql
import random
import flask_cors

dotenv.load_dotenv()

app = Flask(__name__)
flask_cors.CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/start-chat', methods=['POST'])
def start_chat():
    data = request.get_json()
    
    name = data['name']
    age = data['age']
    conversation_time = data['conversation_time']

    
    chat_prompt = get_chat_prompt(name, age, conversation_time)
    first_message = call_llm(chat_prompt)
        
    user_id = random.randint(1, 1000000)
    sql_query = f"INSERT INTO chat_sessions (user_id, name, age, conversation_time, chat_prompt, messages) VALUES (?, ?, ?, ?, ?, ?)", (user_id, name, age, conversation_time, json.dumps(chat_prompt), json.dumps([{"role": "assistant", "content": first_message}]))
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute(*sql_query)
        con.commit()
    
    return jsonify({'user_id': user_id, 'first_message': first_message})
    

@app.route('/get-chat-response', methods=['POST'])
def get_chat_response():
    data = request.get_json()
    
    user_id = data['user_id']
    message = data['message'] # [{'user: ''}, {'assistant': ''},...]
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("SELECT name, age, conversation_time, messages, chat_prompt FROM chat_sessions WHERE user_id=?", (user_id,))
        row = cur.fetchone()
    
    name, age, conversation_time, messages, chat_prompt = row
    messages = json.loads(messages)
    chat_prompt = json.loads(chat_prompt)
    
    messages.append({"role": "user", "content": message})
    
    chat_prompt = chat_prompt + messages
            
    response = call_llm(chat_prompt)
    
    messages.append({"role": "assistant", "content": response})
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("UPDATE chat_sessions SET messages=? WHERE user_id=?", (json.dumps(messages), user_id))
        con.commit()
    
    return response



@app.route('/get-report/<user_id>', methods=['GET'])
def get_report(user_id):
        
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("SELECT name, age, conversation_time, messages FROM chat_sessions WHERE user_id=?", (user_id,))
        rows = cur.fetchall()
    
    name, age, conversation_time, messages = rows[0]
    messages = json.loads(messages)
    
    report_prompt = get_report_prompt(name, age, conversation_time, messages)
    report_response =json.loads(call_llm(report_prompt))
        
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("update chat_sessions set report=? where user_id=?", (json.dumps(report_response), user_id))
        con.commit()
    
    return jsonify(report_response)


@app.route('/get-activities/<user_id>', methods=['GET'])
def get_activities(user_id):
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("SELECT report FROM chat_sessions WHERE user_id=?", (user_id,))
        row = cur.fetchone()
    
    report = json.loads(row[0])
    
    return jsonify(report['activities'])


@app.route('/restart-chat/<user_id>', methods=['POST'])
def restart_chat(user_id):
    
    data = request.get_json()
    activities_done = data['activities_done'] # [{'activity_name': '', 'done': '5/6'},...] 
    
    activities_done_string = '\n'.join([f"{activity['activity_name']}: {activity['done']}" for activity in activities_done])
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("select chat_prompt, report from chat_sessions where user_id=?", (user_id,))
        chat_prompt, report = cur.fetchone()        
    
    report = json.loads(report)
    chat_prompt = json.loads(chat_prompt)
    
    
    appendix = f"""\nSYSTEM MESSAGE:\nThe user had this report from last week's session. REPORT: {report['report']}.\n\n\n They have done the following ACTIVITIES throughout the week (number of repetitions done/total repetitions), ACTIVITIES DONE: \n
{activities_done_string}."""

    chat_prompt[-1]['content'] = chat_prompt[-1]['content'] + appendix
    
    response = call_llm(chat_prompt)
    messages = [{"role": "assistant", "content": response}]
    
    with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("update chat_sessions set messages=?, chat_prompt=? where user_id=?", (json.dumps(messages), json.dumps(chat_prompt), user_id))
        con.commit()
    
    return response



if __name__ == '__main__':
    app.run(debug=True)