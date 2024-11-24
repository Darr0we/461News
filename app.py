import os

import bcrypt
import mysql.connector
import os
import jwt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import timedelta
from contextlib import contextmanager

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)


# Database connection setup
def create_database():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            port=os.getenv('DB_PORT'),
            database='personalized_news_feed'
        )
        return connection
    except mysql.connector.Error as err:
        raise Exception(f"Database connection failed: {err}")

@contextmanager
def db_connection():
    connection = create_database()
    try:
        yield connection
    finally:
        connection.close()

# Helper functions
def validate_required_fields(data, required_fields):
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"Missing or empty field: {field}"
    return True, None

def fetch_paginated_query(query, params, page, per_page, connection):
    offset = (page - 1) * per_page
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query + " LIMIT %s OFFSET %s", (*params, per_page, offset))
    results = cursor.fetchall()
    cursor.close()
    return results

# Routes
@app.route('/')
def home():
    return "Our page is on!"
@app.route('/homepage', methods=['GET'])
@jwt_required()
def homepage():
    user_id = get_jwt_identity()
    with db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        # Fetch topics with high interaction counts
        cursor.execute(
            """
            SELECT topic_id FROM user_topic_interactions
            WHERE user_id = %s
            ORDER BY interaction_count DESC LIMIT 5
            """,
            (user_id,)
        )
        topics = [row['topic_id'] for row in cursor.fetchall()]
        
        # Fetch random articles from these topics
        if topics:
            cursor.execute(
                "SELECT * FROM articles WHERE topic_id IN (%s) ORDER BY RAND() LIMIT 10"
                % ','.join(['%s'] * len(topics)),
                topics
            )
        else:
            # Default to random articles if no preferences
            cursor.execute("SELECT * FROM articles ORDER BY RAND() LIMIT 10")
        articles = cursor.fetchall()
        return jsonify(articles), 200


@app.route('/articles', methods=['GET'])
@jwt_required()
def get_articles():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        if page < 1 or per_page < 1:
            return jsonify({"error": "Invalid pagination parameters"}), 400

        with db_connection() as connection:
            query = "SELECT * FROM articles"
            articles = fetch_paginated_query(query, [], page, per_page, connection)
            return jsonify(articles), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/articles/search', methods=['GET'])
def search_articles():
    query = request.args.get('q', '')
    try:
        with db_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM articles WHERE title LIKE %s OR content LIKE %s",
                (f"%{query}%", f"%{query}%")
            )
            articles = cursor.fetchall()
            return jsonify(articles), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/articles', methods=['POST'])
@jwt_required()
def create_article():
    data = request.get_json()
    required_fields = ['title', 'content', 'author_id', 'topic_id']
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return jsonify({"error": error}), 400

    title = data['title']
    content = data['content']
    author_id = data['author_id']
    topic_id = data['topic_id']

    try:
        with db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO articles (title, content, author_id, topic_id)
                VALUES (%s, %s, %s, %s)
                """,
                (title, content, author_id, topic_id)
            )
            connection.commit()
            return jsonify({"message": "Article created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/articles/<int:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    try:
        with db_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM articles WHERE article_id = %s", (article_id,))
            article = cursor.fetchone()
            if not article:
                return jsonify({"error": "Article not found"}), 404

            # Increment interaction count
            user_id = get_jwt_identity()
            topic_id = article['topic_id']
            cursor.execute(
                """
                INSERT INTO user_topic_interactions (user_id, topic_id, interaction_count)
                VALUES (%s, %s, 1)
                ON DUPLICATE KEY UPDATE interaction_count = interaction_count + 1
                """,
                (user_id, topic_id)
            )
            connection.commit()
            return jsonify(article), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['username', 'email', 'password']
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return jsonify({"error": error}), 400

    username = data['username']
    email = data['email']
    password = data['password']

    try:
        with db_connection() as connection:
            cursor = connection.cursor()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            connection.commit()
            return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    required_fields = ['email', 'password']
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return jsonify({"error": error}), 400

    email = data['email']
    password = data['password']

    try:
        with db_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                access_token = create_access_token(identity=user['user_id'])
                return jsonify(access_token=access_token), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_token), 200

@app.route('/comments', methods=['GET'])
def get_comments():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        if page < 1 or per_page < 1:
            return jsonify({"error": "Invalid pagination parameters"}), 400
        
        with db_connection() as connection:
            query = "SELECT * FROM comments"
            comments = fetch_paginated_query(query, [], page, per_page, connection)
            return jsonify(comments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/comments', methods=['POST'])
@jwt_required()
def create_comment():
    data = request.get_json()
    required_fields = ['user_id', 'article_id', 'comment_text']
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return jsonify({"error": error}), 400

    user_id = data['user_id']
    article_id = data['article_id']
    comment_text = data['comment_text']

    try:
        with db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO comments (user_id, article_id, comment_text) VALUES (%s, %s, %s)",
                (user_id, article_id, comment_text)
            )
            connection.commit()
            return jsonify({"message": "Comment created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/comments/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    try:
        data = request.get_json()
        comment_text = data.get('comment_text')
        with db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE comments SET comment_text = %s WHERE comment_id = %s",
                (comment_text, comment_id)
            )
            connection.commit()
            return jsonify({"message": "Comment updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    with db_connection() as connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM comments WHERE comment_id = %s", (comment_id,))
        connection.commit()
        return jsonify({"message": "Comment deleted successfully!"}), 200
@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        with db_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    with db_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE users SET username = %s, email = %s WHERE user_id = %s",
            (username, email, user_id)
        )
        connection.commit()
        return jsonify({"message": "User updated successfully!"}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    with db_connection() as connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        connection.commit()
        return jsonify({"message": "User deleted successfully!"}), 200


@app.route('/users/<int:user_id>/preferences', methods=['POST'])
@jwt_required()
def save_preferences(user_id):
    data = request.get_json()
    topic_ids = data.get('topic_ids')
    if not topic_ids or not isinstance(topic_ids, list):
        return jsonify({"error": "Invalid topic_ids. Expected a non-empty list."}), 400

    with db_connection() as connection:
        cursor = connection.cursor()
        for topic_id in topic_ids:
            cursor.execute(
                "INSERT IGNORE INTO user_preferences (user_id, topic_id) VALUES (%s, %s)",
                (user_id, topic_id)
            )
        connection.commit()
        return jsonify({"message": "Preferences saved successfully!"}), 201


if __name__ == '__main__':
    app.run(debug=True)
