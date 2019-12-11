import os
from flask import redirect
import database_common
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


@database_common.connection_handler
def get_mentor_names_by_first_name(cursor, first_name):
    cursor.execute("""
                    SELECT first_name, last_name FROM mentors
                    WHERE first_name = %(first_name)s ORDER BY first_name;
                   """,
                   {'first_name': first_name})
    names = cursor.fetchall()
    return names


@database_common.connection_handler
def get_mentors_names_lastnames(cursor):
    cursor.execute("SELECT first_name, last_name FROM mentors;")
    names = cursor.fetchall()
    return names


@database_common.connection_handler
def miskolc_mentors_nicknames(cursor):
    cursor.execute("SELECT nick_name FROM mentors WHERE city = 'Miskolc';")
    miskolc_mentors_nicknames = cursor.fetchall()
    return miskolc_mentors_nicknames


@database_common.connection_handler
def carols_fullname_number(cursor):
    cursor.execute("SELECT first_name, last_name, phone_number FROM applicants WHERE first_name = 'Carol';")
    carols_fullname_number = cursor.fetchall()
    return carols_fullname_number


@database_common.connection_handler
def another_girls_fullname_number(cursor):
    cursor.execute(
        "SELECT first_name, last_name, phone_number FROM applicants WHERE email LIKE '%@adipiscingenimmi.edu';")
    another_girls_fullname_number = cursor.fetchall()
    return another_girls_fullname_number


@database_common.connection_handler
def add_new_applicant(cursor, first_name, last_name, phone_number, email, application_code, request, app):
    user_image_name = change_user_image_name(request, application_code)
    try:
        if user_image_name:
            cursor.execute(
                "INSERT INTO applicants(first_name, last_name, phone_number, email, application_code, user_image_name) VALUES(%s, %s, %s, %s, %s, %s)",
                (first_name, last_name, phone_number, email, application_code, user_image_name))
            upload_file(request, app, user_image_name)
            return True
        else:
            cursor.execute(
                "INSERT INTO applicants(first_name, last_name, phone_number, email, application_code) VALUES(%s, %s, %s, %s, %s)",
                (first_name, last_name, phone_number, email, application_code))

            return True
    except Exception:
        print("Something wrong with add_new_applicant")


@database_common.connection_handler
def get_applicant_info(cursor, application_code):
    try:
        cursor.execute("SELECT * FROM applicants WHERE application_code = %s", (application_code,))
        applicant_info = cursor.fetchone()
        return applicant_info
    except Exception:
        print("Something wrong")


@database_common.connection_handler
def get_applicants_info(cursor):
    try:
        cursor.execute("SELECT * FROM applicants ORDER BY id DESC")
        applicants_info = cursor.fetchall()
        return applicants_info
    except Exception:
        print("Something wrong with get_applicants_info")


@database_common.connection_handler
def get_applicant_info_by_id(cursor, id):
    try:
        cursor.execute("SELECT * FROM applicants WHERE id = %s", (id,))
        applicant_info_by_id = cursor.fetchone()
        return applicant_info_by_id
    except Exception:
        print("Something wrong with get_applicant_info_by_id")


@database_common.connection_handler
def update_applicant_information(cursor, id, first_name, last_name, phone_number, email, application_code):
    try:
        cursor.execute(
            "UPDATE applicants SET first_name = %s, last_name = %s, phone_number = %s, email = %s, application_code = %s WHERE id = %s",
            (id, first_name, last_name, phone_number, email, application_code))
        return True
    except Exception:
        print("Something wrong with update_applicant_information")

@database_common.connection_handler
def get_applicant_app_code(cursor, app_id):
    try:
        cursor.execute("SELECT user_image_name FROM applicants WHERE id = %s", (app_id,))
        file_to_delete = cursor.fetchone()
        return file_to_delete
    except Exception:
        print("Something wrong with get_applicant_app_code")



@database_common.connection_handler
def delete_applicant(cursor, app_id):
    try:
        cursor.execute("DELETE FROM applicants WHERE id = %s", (app_id,))
        return True
    except Exception:
        print("Something wrong with delete_applicant")


@database_common.connection_handler
def delete_applicant_image(cursor, app_code):
    file_to_delete = 'static/user_images/' + app_code['user_image_name']
    try:
        if os.path.exists(file_to_delete):
            os.remove(file_to_delete)
        else:
            print("The file does not exist")
        return True
    except Exception:
        print("Something wrong with delete_applicant_image")


@database_common.connection_handler
def mentors_and_schools_info(cursor):
    cursor.execute(
        "SELECT mentors.first_name as mentors_name, mentors.last_name as mentors_lastname,"
        "schools.name as schools_name, schools.country as schools_country "
        "FROM mentors INNER JOIN schools ON mentors.id = schools.contact_person ORDER BY mentors.id")
    names = cursor.fetchall()
    return names


@database_common.connection_handler
def all_school_info(cursor):
    cursor.execute(
        "SELECT mentors.first_name as mentors_name, mentors.last_name as mentors_lastname, "
        "schools.name as schools_name, schools.country as schools_country "
        "FROM mentors RIGHT JOIN schools ON mentors.id = schools.contact_person ORDER BY mentors.id")
    names = cursor.fetchall()
    return names


@database_common.connection_handler
def mentors_by_country(cursor):
    cursor.execute(
        "SELECT COUNT(first_name) as Hungary FROM mentors WHERE city = 'Miskolc' OR city = 'Budapest'")
    names = cursor.fetchall()
    cursor.execute(
        "SELECT COUNT(first_name) as Poland FROM mentors WHERE city = 'Krakow' OR city = 'Warsaw'")
    names.extend(cursor.fetchall())
    return names


@database_common.connection_handler
def school_contacts(cursor):
    cursor.execute(
        "SELECT schools.name as schools_name, mentors.first_name as mentors_name, mentors.last_name as mentors_lastname"
        " FROM mentors RIGHT JOIN schools ON mentors.id = schools.contact_person ORDER BY schools.name")
    names = cursor.fetchall()
    return names


@database_common.connection_handler
def applicants(cursor):
    cursor.execute(
            "SELECT applicants.first_name, applicants.application_code, mentors.first_name as mentors_name "
        "FROM applicants INNER JOIN mentors ON applicants.mentor_id = mentors.id ORDER BY applicants.id")
    names = cursor.fetchall()
    return names\


@database_common.connection_handler
def applicants_and_mentors(cursor):
    cursor.execute(
            "SELECT applicants.first_name, applicants.application_code, mentors.first_name as mentors_name, mentors.last_name as mentors_lastname "
        "FROM applicants RIGHT JOIN mentors ON applicants.mentor_id = mentors.id ORDER BY applicants.first_name")
    names = cursor.fetchall()
    return names


# is file type allowed DON'T USED
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# change user filename to saving
def change_user_image_name(request, application_code):
    file = request.files['user_image']
    user_image_name = secure_filename(file.filename)
    if user_image_name:
        splitted_name = user_image_name.split('.')
        new_name = application_code+'.'+splitted_name[-1]
        return new_name
    return False

# secure saving users image
def upload_file(request, app, user_image_name):
    file = request.files['user_image']
    filename = user_image_name
    if file:
         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
