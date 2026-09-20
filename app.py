from flask import Flask, render_template, request, jsonify, session
import sqlite3
import json
import os
from functools import wraps

# =========================================================
# SENSOFOOD APPLICATION
# =========================================================

app = Flask(__name__,
 template_folder="templates", static_folder="static")

# =========================================================
# APPLICATION CONFIGURATION
# =========================================================

app.secret_key = os.environ.get(
    "SENSOFOOD_SECRET_KEY",
    "sensofood-local-secret-key"
)

# Database is stored next to app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sensofood.db")

# Researcher login
RESEARCHER_USERNAME = os.environ.get(
    "SENSOFOOD_RESEARCHER_USERNAME",
    "researcher"
)

RESEARCHER_PASSWORD = os.environ.get(
    "SENSOFOOD_RESEARCHER_PASSWORD",
    "change-this-password"
)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

    return conn


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def init_db():

    conn = get_db()

    # -----------------------------------------------------
    # PARTICIPANTS
    # -----------------------------------------------------

    conn.execute("""
        CREATE TABLE IF NOT EXISTS participants (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            participant_id TEXT UNIQUE NOT NULL,

            age INTEGER,

            group_name TEXT NOT NULL
                DEFAULT 'Neurotypical',

            created_at TEXT NOT NULL
                DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # -----------------------------------------------------
    # ASSESSMENTS
    # -----------------------------------------------------

    conn.execute("""
        CREATE TABLE IF NOT EXISTS assessments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            participant_id TEXT NOT NULL,

            answers TEXT NOT NULL,

            created_at TEXT NOT NULL
                DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # -----------------------------------------------------
    # RESULTS
    # -----------------------------------------------------

    conn.execute("""
        CREATE TABLE IF NOT EXISTS results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            participant_id TEXT NOT NULL,

            olfactory REAL,

            taste REAL,

            texture REAL,

            visual REAL,

            food_acceptance REAL,

            overall REAL,

            temperature REAL,

            created_at TEXT NOT NULL
                DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # -----------------------------------------------------
    # SUPPORT OLD DATABASES
    # -----------------------------------------------------

    columns = conn.execute(
        "PRAGMA table_info(results)"
    ).fetchall()

    column_names = [
        column["name"]
        for column in columns
    ]

    if "temperature" not in column_names:

        conn.execute("""
            ALTER TABLE results
            ADD COLUMN temperature REAL
        """)

    conn.commit()

    conn.close()


# =========================================================
# RESEARCHER AUTHENTICATION
# =========================================================

def researcher_required(function):

    @wraps(function)
    def decorated_function(*args, **kwargs):

        auth = request.authorization

        if not auth:

            return jsonify({
                "success": False,
                "message": "Researcher authentication required"
            }), 401, {
                "WWW-Authenticate":
                'Basic realm="SensoFood Researcher Area"'
            }

        if (
            auth.username != RESEARCHER_USERNAME
            or
            auth.password != RESEARCHER_PASSWORD
        ):

            return jsonify({
                "success": False,
                "message": "Invalid researcher credentials"
            }), 401, {
                "WWW-Authenticate":
                'Basic realm="SensoFood Researcher Area"'
            }

        return function(*args, **kwargs)

    return decorated_function


# =========================================================
# PAGES
# =========================================================

@app.route("/")
@app.route("/index.html")
def index():

    return render_template("index.html")


@app.route("/consent")
@app.route("/consent.html")
def consent():

    return render_template("consent.html")


@app.route("/participants")
@app.route("/participants.html")
def participants():

    return render_template("participants.html")


# =========================================================
# ASSESSMENT
# =========================================================

@app.route("/assessment")
@app.route("/assessment.html")
def assessment():

    return render_template("assessment.html")


@app.route("/result")
@app.route("/result.html")
def result():

    return render_template("result.html")


@app.route("/about")
@app.route("/about.html")
def about():

    return render_template("about.html")


# =========================================================
# RESEARCH DASHBOARD
# =========================================================

@app.route("/dashboard")
@app.route("/dashboard.html")
@researcher_required
def dashboard():

    return render_template("dashboard.html")


# =========================================================
# SAVE PARTICIPANT
# =========================================================

@app.route("/api/participant", methods=["POST"])
def save_participant():

    data = request.get_json(silent=True)

    if not data:

        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    participant_id = str(
        data.get("participant_id", "")
    ).strip()

    age = data.get("age")

    group_name = str(
        data.get("group", "Neurotypical")
    ).strip()

    # -----------------------------------------------------
    # PARTICIPANT ID
    # -----------------------------------------------------

    if not participant_id:

        return jsonify({
            "success": False,
            "message": "Participant ID is required"
        }), 400

    # -----------------------------------------------------
    # GROUP
    # -----------------------------------------------------

    if group_name not in [
        "Neurotypical",
        "Autistic"
    ]:

        return jsonify({
            "success": False,
            "message": "Invalid participant group"
        }), 400

    # -----------------------------------------------------
    # AGE
    # -----------------------------------------------------

    try:

        age = int(age) if age not in [None, ""] else None

    except (ValueError, TypeError):

        return jsonify({
            "success": False,
            "message": "Invalid age"
        }), 400

    if age is not None:

        if age < 1 or age > 120:

            return jsonify({
                "success": False,
                "message": "Age must be between 1 and 120"
            }), 400

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    conn = get_db()

    try:

        conn.execute("""
            INSERT INTO participants
            (
                participant_id,
                age,
                group_name
            )
            VALUES (?, ?, ?)
        """, (
            participant_id,
            age,
            group_name
        ))

        conn.commit()

        message = "Participant saved successfully"

    except sqlite3.IntegrityError:

        conn.execute("""
            UPDATE participants

            SET
                age = ?,
                group_name = ?

            WHERE participant_id = ?
        """, (
            age,
            group_name,
            participant_id
        ))

        conn.commit()

        message = "Participant updated successfully"

    conn.close()

    # -----------------------------------------------------
    # SESSION
    # -----------------------------------------------------

    session["participant_id"] = participant_id

    return jsonify({

        "success": True,

        "message": message,

        "participant_id": participant_id,

        "group": group_name

    })


# =========================================================
# SAVE ASSESSMENT
# =========================================================

@app.route("/api/assessment", methods=["POST"])
def save_assessment():

    data = request.get_json(silent=True)

    if not data:

        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    requested_participant_id = str(
        data.get("participant_id", "")
    ).strip()

    answers = data.get("answers")

    # -----------------------------------------------------
    # SESSION
    # -----------------------------------------------------

    session_participant_id = session.get(
        "participant_id"
    )

    if not session_participant_id:

        return jsonify({
            "success": False,
            "message": "Participant session not found"
        }), 401

    if requested_participant_id != session_participant_id:

        return jsonify({
            "success": False,
            "message": "Participant session mismatch"
        }), 403

    participant_id = session_participant_id

    # -----------------------------------------------------
    # ANSWERS
    # -----------------------------------------------------

    if not isinstance(answers, dict):

        return jsonify({
            "success": False,
            "message": "Invalid assessment answers"
        }), 400

    if len(answers) != 20:

        return jsonify({
            "success": False,
            "message": "All 20 questions must be answered"
        }), 400

    # -----------------------------------------------------
    # SUPPORT 0-19 AND 1-20
    # -----------------------------------------------------

    cleaned_answers = {}

    zero_based = all(
        str(i) in answers
        for i in range(20)
    )

    one_based = all(
        str(i) in answers
        for i in range(1, 21)
    )

    if zero_based:

        for i in range(20):

            value = answers.get(str(i))

            try:
                value = int(value)

            except (ValueError, TypeError):

                return jsonify({
                    "success": False,
                    "message":
                    f"Invalid answer for question {i + 1}"
                }), 400

            if value < 1 or value > 5:

                return jsonify({
                    "success": False,
                    "message":
                    f"Answer for question {i + 1} "
                    "must be between 1 and 5"
                }), 400

            cleaned_answers[str(i + 1)] = value

    elif one_based:

        for i in range(1, 21):

            value = answers.get(str(i))

            try:
                value = int(value)

            except (ValueError, TypeError):

                return jsonify({
                    "success": False,
                    "message":
                    f"Invalid answer for question {i}"
                }), 400

            if value < 1 or value > 5:

                return jsonify({
                    "success": False,
                    "message":
                    f"Answer for question {i} "
                    "must be between 1 and 5"
                }), 400

            cleaned_answers[str(i)] = value

    else:

        return jsonify({
            "success": False,
            "message":
            "Assessment must contain exactly "
            "20 valid questions"
        }), 400

    # -----------------------------------------------------
    # PARTICIPANT EXISTS
    # -----------------------------------------------------

    conn = get_db()

    participant = conn.execute("""
        SELECT
            participant_id,
            age,
            group_name

        FROM participants

        WHERE participant_id = ?
    """, (
        participant_id,
    )).fetchone()

    if participant is None:

        conn.close()

        return jsonify({
            "success": False,
            "message": "Participant not found"
        }), 404

    # -----------------------------------------------------
    # SAVE ASSESSMENT
    # -----------------------------------------------------

    cursor = conn.execute("""
        INSERT INTO assessments
        (
            participant_id,
            answers
        )
        VALUES (?, ?)
    """, (
        participant_id,
        json.dumps(
            cleaned_answers,
            ensure_ascii=False
        )
    ))

    assessment_id = cursor.lastrowid

    # -----------------------------------------------------
    # FIVE SENSORY DIMENSIONS
    # -----------------------------------------------------

    olfactory = sum(
        cleaned_answers[str(i)]
        for i in range(1, 5)
    ) / 4

    taste = sum(
        cleaned_answers[str(i)]
        for i in range(5, 9)
    ) / 4

    texture = sum(
        cleaned_answers[str(i)]
        for i in range(9, 13)
    ) / 4

    temperature = sum(
        cleaned_answers[str(i)]
        for i in range(13, 17)
    ) / 4

    visual = sum(
        cleaned_answers[str(i)]
        for i in range(17, 21)
    ) / 4

    overall = sum(
        cleaned_answers.values()
    ) / 20

    food_acceptance = (
        cleaned_answers["4"] +
        cleaned_answers["8"] +
        cleaned_answers["12"] +
        cleaned_answers["16"] +
        cleaned_answers["20"]
    ) / 5

    # -----------------------------------------------------
    # SAVE RESULTS
    # -----------------------------------------------------

    conn.execute("""
        INSERT INTO results
        (
            participant_id,
            olfactory,
            taste,
            texture,
            visual,
            food_acceptance,
            overall,
            temperature
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        participant_id,
        round(olfactory, 2),
        round(taste, 2),
        round(texture, 2),
        round(visual, 2),
        round(food_acceptance, 2),
        round(overall, 2),
        round(temperature, 2)
    ))

    conn.commit()

    conn.close()

    return jsonify({

        "success": True,

        "message":
        "Assessment saved successfully",

        "assessment_id":
        assessment_id,

        "results": {

            "olfactory":
            round(olfactory, 2),

            "taste":
            round(taste, 2),

            "texture":
            round(texture, 2),

            "temperature":
            round(temperature, 2),

            "visual":
            round(visual, 2),

            "food_acceptance":
            round(food_acceptance, 2),

            "overall":
            round(overall, 2)

        }

    })


# =========================================================
# PARTICIPANT RESULT
# =========================================================

@app.route("/api/my-result", methods=["GET"])
def my_result():

    participant_id = session.get(
        "participant_id"
    )

    if not participant_id:

        return jsonify({
            "success": False,
            "message": "Participant session not found"
        }), 401

    conn = get_db()

    participant = conn.execute("""
        SELECT
            participant_id,
            age,
            group_name

        FROM participants

        WHERE participant_id = ?
    """, (
        participant_id,
    )).fetchone()

    result = conn.execute("""
        SELECT
            participant_id,
            olfactory,
            taste,
            texture,
            temperature,
            visual,
            food_acceptance,
            overall,
            created_at

        FROM results

        WHERE participant_id = ?

        ORDER BY id DESC

        LIMIT 1
    """, (
        participant_id,
    )).fetchone()

    conn.close()

    if participant is None:

        return jsonify({
            "success": False,
            "message": "Participant not found"
        }), 404

    if result is None:

        return jsonify({
            "success": False,
            "message": "No assessment result available"
        }), 404

    return jsonify({

        "success": True,

        "participant": {

            "participant_id":
            participant["participant_id"],

            "age":
            participant["age"],

            "group":
            participant["group_name"]

        },

        "results": {

            "olfactory":
            result["olfactory"],

            "taste":
            result["taste"],

            "texture":
            result["texture"],

            "temperature":
            result["temperature"],

            "visual":
            result["visual"],

            "food_acceptance":
            result["food_acceptance"],

            "overall":
            result["overall"]

        }

    })


# =========================================================
# DASHBOARD DATA
# =========================================================

@app.route("/api/dashboard", methods=["GET"])
@researcher_required
def dashboard_data():

    conn = get_db()

    count_row = conn.execute("""
        SELECT COUNT(*) AS total
        FROM participants
    """).fetchone()

    participants = conn.execute("""
        SELECT

            p.participant_id,
            p.age,
            p.group_name,
            p.created_at,

            r.olfactory,
            r.taste,
            r.texture,
            r.temperature,
            r.visual,
            r.food_acceptance,
            r.overall,
            r.created_at AS result_date

        FROM participants p

        LEFT JOIN results r
        ON r.id = (
            SELECT r2.id
            FROM results r2
            WHERE r2.participant_id = p.participant_id
            ORDER BY r2.id DESC
            LIMIT 1
        )

        ORDER BY p.id DESC
    """).fetchall()

    conn.close()

    participant_list = []

    for participant in participants:

        participant_list.append({

            "participant_id":
            participant["participant_id"],

            "age":
            participant["age"],

            "group":
            participant["group_name"],

            "created_at":
            participant["created_at"],

            "results": {

                "olfactory":
                participant["olfactory"],

                "taste":
                participant["taste"],

                "texture":
                participant["texture"],

                "temperature":
                participant["temperature"],

                "visual":
                participant["visual"],

                "food_acceptance":
                participant["food_acceptance"],

                "overall":
                participant["overall"]

            }

        })

    return jsonify({

        "success": True,

        "total":
        count_row["total"],

        "participants":
        participant_list

    })


# =========================================================
# INDIVIDUAL PARTICIPANT
# =========================================================

@app.route(
    "/api/dashboard/participant/<participant_id>",
    methods=["GET"]
)
@researcher_required
def participant_data(participant_id):

    conn = get_db()

    participant = conn.execute("""
        SELECT
            participant_id,
            age,
            group_name,
            created_at

        FROM participants

        WHERE participant_id = ?
    """, (
        participant_id,
    )).fetchone()

    if participant is None:

        conn.close()

        return jsonify({
            "success": False,
            "message": "Participant not found"
        }), 404

    result = conn.execute("""
        SELECT
            olfactory,
            taste,
            texture,
            temperature,
            visual,
            food_acceptance,
            overall,
            created_at

        FROM results

        WHERE participant_id = ?

        ORDER BY id DESC

        LIMIT 1
    """, (
        participant_id,
    )).fetchone()

    assessment = conn.execute("""
        SELECT
            id,
            answers,
            created_at

        FROM assessments

        WHERE participant_id = ?

        ORDER BY id DESC

        LIMIT 1
    """, (
        participant_id,
    )).fetchone()

    conn.close()

    answers = None

    if assessment:

        try:

            answers = json.loads(
                assessment["answers"]
            )

        except (
            json.JSONDecodeError,
            TypeError
        ):

            answers = None

    result_data = None

    if result:

        result_data = {

            "olfactory":
            result["olfactory"],

            "taste":
            result["taste"],

            "texture":
            result["texture"],

            "temperature":
            result["temperature"],

            "visual":
            result["visual"],

            "food_acceptance":
            result["food_acceptance"],

            "overall":
            result["overall"],

            "created_at":
            result["created_at"]

        }

    return jsonify({

        "success": True,

        "participant": {

            "participant_id":
            participant["participant_id"],

            "age":
            participant["age"],

            "group":
            participant["group_name"],

            "created_at":
            participant["created_at"]

        },

        "result":
        result_data,

        "assessment": {

            "id":
            assessment["id"]
            if assessment else None,

            "answers":
            answers,

            "created_at":
            assessment["created_at"]
            if assessment else None

        }

    })


# =========================================================
# DASHBOARD STATISTICS
# =========================================================

@app.route(
    "/api/dashboard/statistics",
    methods=["GET"]
)
@researcher_required
def dashboard_statistics():

    conn = get_db()

    total_participants = conn.execute("""
        SELECT COUNT(*)
        FROM participants
    """).fetchone()[0]

    neurotypical_count = conn.execute("""
        SELECT COUNT(*)
        FROM participants
        WHERE group_name = 'Neurotypical'
    """).fetchone()[0]

    autistic_count = conn.execute("""
        SELECT COUNT(*)
        FROM participants
        WHERE group_name = 'Autistic'
    """).fetchone()[0]

    total_assessments = conn.execute("""
        SELECT COUNT(*)
        FROM assessments
    """).fetchone()[0]

    conn.close()

    return jsonify({

        "success": True,

        "statistics": {

            "total_participants":
            total_participants,

            "neurotypical":
            neurotypical_count,

            "autistic":
            autistic_count,

            "total_assessments":
            total_assessments

        }

    })


# =========================================================
# PARTICIPANT LOGOUT
# =========================================================

@app.route(
    "/api/participant/logout",
    methods=["POST"]
)
def participant_logout():

    session.pop(
        "participant_id",
        None
    )

    return jsonify({

        "success": True,

        "message":
        "Participant session cleared"

    })


# =========================================================
# ERROR HANDLER
# =========================================================

@app.errorhandler(404)
def page_not_found(error):

    # Return JSON only for API requests
    if request.path.startswith("/api/"):

        return jsonify({

            "success": False,

            "message":
            "Page or resource not found"

        }), 404

    # Return the normal homepage for
    # unknown browser page requests
    return render_template(
        "index.html"
    )


# =========================================================
# INITIALIZE DATABASE
# =========================================================

init_db()


# =========================================================
# START APPLICATION
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )