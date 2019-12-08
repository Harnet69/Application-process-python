import database_common


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
def add_new_applicant(cursor, first_name, last_name, phone_number, email, application_code):
    try:
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
def delete_applicant(cursor, app_id):
    try:
        cursor.execute("DELETE FROM applicants WHERE id = %s", (app_id,))
        return True
    except Exception:
        print("Something wrong with delete_applicant")


@database_common.connection_handler
def mentors_and_schools_info(cursor):
    cursor.execute("SELECT mentors.first_name as mentors_name, mentors.last_name as mentors_lastname, schools.name as schools_name, schools.country as schools_country FROM mentors INNER JOIN schools ON mentors.id = schools.contact_person")
    names = cursor.fetchall()
    return names
