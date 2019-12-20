import os
from flask import flash
import database_common
from werkzeug.utils import secure_filename
import user_functions

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
def add_new_applicant(cursor, first_name, last_name, phone_number, email, application_code, who_add_app, request, app):
    who_add_app_id = get_user_info_by_login(who_add_app)  # get user info from database
    who_add_app = who_add_app_id['id']  # find user id for add it to applicant info
    user_image_name = change_user_image_name(request, application_code) # change user image name, and check an file extension
    try:
        if user_image_name:
            cursor.execute(
                "INSERT INTO applicants(first_name, last_name, phone_number, email, application_code, user_image_name, user_id) VALUES(%s, %s, %s, %s, %s, %s, %s)",
                (first_name, last_name, phone_number, email, application_code, user_image_name, who_add_app))
            upload_file(request, app, user_image_name)
            return True
        else:
            cursor.execute(
                "INSERT INTO applicants(first_name, last_name, phone_number, email, application_code, user_id) VALUES(%s, %s, %s, %s, %s, %s)",
                (first_name, last_name, phone_number, email, application_code, who_add_app))

            return True
    except Exception:
        print("Something wrong with add_new_applicant")


# get applicant's info by applicant code
@database_common.connection_handler
def get_applicant_info(cursor, application_code):
    try:
        cursor.execute("SELECT * FROM applicants WHERE application_code = %s", (application_code,))
        applicant_info = cursor.fetchone()
        return applicant_info
    except Exception:
        print("Something wrong with get applicant info by applicant code")


# get applicant's info with user login
@database_common.connection_handler
def get_applicants_info(cursor):
    try:
        cursor.execute("SELECT applicants.id, applicants.first_name, applicants.last_name, applicants.phone_number, "
                       "applicants.email, applicants.application_code, applicants.mentor_id, applicants.user_image_name, "
                       "users.login as hr FROM applicants INNER JOIN users on applicants.user_id = users.id "
                       "ORDER BY applicants.id DESC")
        applicants_info = cursor.fetchall()
        return applicants_info
    except Exception:
        print("Something wrong with get_applicants_info")


# get all applicant's info with user login by applicant id
@database_common.connection_handler
def get_applicant_info_by_id(cursor, id):
    try:
        cursor.execute("SELECT * FROM applicants WHERE id = %s", (id,))
        applicant_info_by_id = cursor.fetchone()
        return applicant_info_by_id
    except Exception:
        print("Something wrong with get_applicant_info_by_id")


# update applicant information
@database_common.connection_handler
def update_applicant_information(cursor, first_name, last_name, phone_number, email, application_code, id, request, app):
    try:
        user_image_name = change_user_image_name(request, application_code)
        file = request.files['user_image']
        if file:
            upload_file(request, app, user_image_name)
            cursor.execute(
                "UPDATE applicants SET first_name = %s, last_name = %s, phone_number = %s, email = %s, application_code = %s, user_image_name = %s WHERE id = %s",
                (first_name, last_name, phone_number, email, application_code, user_image_name, id))
        else:
            cursor.execute(
                "UPDATE applicants SET first_name = %s, last_name = %s, phone_number = %s, email = %s, application_code = %s WHERE id = %s",
                (first_name, last_name, phone_number, email, application_code, id))
        return True
    except Exception:
        print("Something wrong with update_applicant_information")


# get applicant application code by applicant's id
@database_common.connection_handler
def get_applicant_app_code(cursor, app_id):
    try:
        cursor.execute("SELECT user_image_name FROM applicants WHERE id = %s", (app_id,))
        file_to_delete = cursor.fetchone()
        return file_to_delete
    except Exception:
        print("Something wrong with get_applicant_app_code")\


#  PROBABLY UNSED FUNCTION, DELETE AFFTER TESTING!
# @database_common.connection_handler
# def get_applicant_application_code(cursor, app_id):
#     try:
#         cursor.execute("SELECT application_code FROM applicants WHERE id = %s", (app_id,))
#         file_to_delete = cursor.fetchone()
#         return file_to_delete
#     except Exception:
#         print("Something wrong with get_applicant_app_code")
#

# delete applicant by id
@database_common.connection_handler
def delete_applicant(cursor, app_id):
    try:
        cursor.execute("DELETE FROM applicants WHERE id = %s", (app_id,))
        return True
    except Exception:
        print("Something wrong with delete_applicant")


# delete applicant's image by app_code
@database_common.connection_handler
def delete_applicant_image(cursor, app_code):
    try:
        file_to_delete = 'static/user_images/' + app_code['user_image_name']
        if os.path.exists(file_to_delete):
            os.remove(file_to_delete)
        else:
            print("The file does not exist")
        return True
    except Exception:
        print("Something wrong with delete_applicant_image")


# show mentors and schools info
@database_common.connection_handler
def mentors_and_schools_info(cursor):
    cursor.execute(
        "SELECT mentors.first_name as mentors_name, mentors.last_name as mentors_lastname,"
        "schools.name as schools_name, schools.country as schools_country "
        "FROM mentors INNER JOIN schools ON mentors.id = schools.contact_person ORDER BY mentors.id")
    names = cursor.fetchall()
    return names


# show schools info
@database_common.connection_handler
def all_school_info(cursor):
    cursor.execute(
        "SELECT mentors.first_name as mentors_name, mentors.last_name as mentors_lastname, "
        "schools.name as schools_name, schools.country as schools_country "
        "FROM mentors RIGHT JOIN schools ON mentors.id = schools.contact_person ORDER BY mentors.id")
    names = cursor.fetchall()
    return names


# show mentors by country
@database_common.connection_handler
def mentors_by_country(cursor):
    cursor.execute(
        "SELECT COUNT(first_name) as Hungary FROM mentors WHERE city = 'Miskolc' OR city = 'Budapest'")
    names = cursor.fetchall()
    cursor.execute(
        "SELECT COUNT(first_name) as Poland FROM mentors WHERE city = 'Krakow' OR city = 'Warsaw'")
    names.extend(cursor.fetchall())
    return names


# show school contacts
@database_common.connection_handler
def school_contacts(cursor):
    cursor.execute(
        "SELECT schools.name as schools_name, mentors.first_name as mentors_name, mentors.last_name as mentors_lastname"
        " FROM mentors RIGHT JOIN schools ON mentors.id = schools.contact_person ORDER BY schools.name")
    names = cursor.fetchall()
    return names


# show applicants and their mentors
@database_common.connection_handler
def applicants(cursor):
    cursor.execute(
            "SELECT applicants.first_name, applicants.application_code, mentors.first_name as mentors_name "
        "FROM applicants INNER JOIN mentors ON applicants.mentor_id = mentors.id ORDER BY applicants.id")
    names = cursor.fetchall()
    return names\


# show applicants and their mentors
@database_common.connection_handler
def applicants_and_mentors(cursor):
    cursor.execute(
            "SELECT applicants.first_name, applicants.application_code, mentors.first_name as mentors_name, mentors.last_name as mentors_lastname "
        "FROM applicants RIGHT JOIN mentors ON applicants.mentor_id = mentors.id ORDER BY applicants.first_name")
    names = cursor.fetchall()
    return names


# check if file extension is allowed and change user filename for saving
def change_user_image_name(request, application_code):
    file = request.files['user_image']
    if file:
        user_image_name = secure_filename(file.filename)
        split_name = user_image_name.split('.')
        extension = split_name[-1]

        if extension.lower() in ALLOWED_EXTENSIONS:
            new_name = application_code+'.'+extension.lower()
            return new_name
        else:
            print("Your file isn't image!")  # TODO show message to user if its image isn't image
            flash(f"Format '{extension}' isn't allowed! Send only images!")
            return False
    else:
        return False


# saving users image
def upload_file(request, app, user_image_name):
    file = request.files['user_image']
    filename = user_image_name
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


# add new user
@database_common.connection_handler
def add_new_user(cursor, first_name, last_name, email, login, password, confirm_password, request, app):
    #  if users password is not match with confirm_password
    if password == confirm_password:
        hashed_password = user_functions.hash_password(password)
        user_image_name = change_user_image_name(request, login)
        if not user_image_name:
            return False
        try:
            if user_image_name:
                cursor.execute(
                    "INSERT INTO users(first_name, last_name, email, login, password, user_image) VALUES(%s, %s, %s, %s, %s, %s)",
                    (first_name, last_name, email, login, hashed_password, user_image_name))
                upload_file(request, app, user_image_name)
                return True
            else:
                cursor.execute(
                    "INSERT INTO users(first_name, last_name, email, login, password) VALUES(%s, %s, %s, %s, %s)",
                    (first_name, last_name, email, login, hashed_password))
                return True
        except Exception:
            print("Something wrong with add_new_user")
    else:
        flash("passwords aren't mach")
        return False


# get user info by login
@database_common.connection_handler
def get_user_info_by_login(cursor, login):
    try:
        cursor.execute("SELECT first_name, last_name, email, login, user_image, id, super_user "
                       "FROM users "
                       "WHERE login = %s", (login,))
        user_info_by_login = cursor.fetchone()
        return user_info_by_login
    except Exception:
        print("Something wrong with get_user_info_by_login")


# get user password by login
@database_common.connection_handler
def get_user_password_by_login(cursor, login):
    try:
        cursor.execute("SELECT password FROM users WHERE login = %s", (login,))
        user_password = cursor.fetchone()
        return user_password
    except Exception:
        print("Something wrong with get_user_password")


# edit user information
@database_common.connection_handler
def edit_user_information(cursor, first_name, last_name, email, login, old_password, new_password, confirm_password, id, request, app):
    # if user want to change a password
    if old_password and new_password and confirm_password:
        psw_from_db = get_user_password_by_login(login)
        # if user password is the same password from a database
        if user_functions.verify_password(old_password, psw_from_db['password']):
            #  if users password match with confirm_password
            if new_password == confirm_password:
                hashed_password = user_functions.hash_password(new_password)
                user_image_name = change_user_image_name(request, login)
                try:
                    file = request.files['user_image']
                    if file:
                        upload_file(request, app, user_image_name)
                        cursor.execute(
                            "UPDATE users SET first_name = %s, last_name = %s, email = %s, password = %s, user_image = %s WHERE id = %s",
                            (first_name, last_name, email, hashed_password, user_image_name, id))
                    else:
                        cursor.execute(
                            "UPDATE users SET first_name = %s, last_name = %s, email = %s, password = %s WHERE id = %s",
                            (first_name, last_name, email, hashed_password, id))
                    flash("User's information and password have been updated!")
                    return True
                except Exception:
                    print("Something wrong with add_new_user")
            else:
                flash("New password and confirmed password don't match")
                return False
        else:
            flash("Old password is wrong!!!")
            return False
    # if user don't change a password
    else:
        user_image_name = change_user_image_name(request, login)
        try:
            file = request.files['user_image']
            if file:
                upload_file(request, app, user_image_name)
                cursor.execute(
                    "UPDATE users SET first_name = %s, last_name = %s, email = %s,user_image = %s WHERE id = %s",
                    (first_name, last_name, email, user_image_name, id))
            else:
                cursor.execute(
                    "UPDATE users SET first_name = %s, last_name = %s, email = %s WHERE id = %s",
                    (first_name, last_name, email, id))
            flash("User's information has been updated!")
            return True
        except Exception:
            print("Something wrong with add_new_user")
            return False


# is user login in database
@database_common.connection_handler
def get_login_password_from_db(cursor, login):
    try:
        cursor.execute("SELECT login, password FROM users WHERE login = %s", (login,))
        user_login_password = cursor.fetchone()
        return user_login_password
    except Exception:
        print("Something wrong with is_login_in_db")