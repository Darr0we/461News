from flask import Flask, jsonify, request
import mysql.connector
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

def create_database():
    connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database='personalized_news_feed'
    )
    return connection

@app.route('/')
def home():
    return "Our page is on!"

@app.route('/articles', methods=['GET'])
def get_articles():
    connection = create_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM articles")
    articles = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(articles), 200

@app.route('/users', methods=['GET'])
def get_user():
    connection = create_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(users), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  

    connection = create_database()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, password)
    )
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    connection = create_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user and user['password_hash'] == password:
        access_token = create_access_token(identity=user['user_id'])
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)
