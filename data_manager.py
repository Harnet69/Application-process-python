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
    cursor.execute("SELECT first_name, last_name, phone_number FROM applicants WHERE email LIKE '%@adipiscingenimmi.edu';")
    another_girls_fullname_number = cursor.fetchall()
    return another_girls_fullname_number

@database_common.connection_handler
def add_new_applicant(cursor, first_name, last_name, phone_number, email, application_code):
    try:
        cursor.execute("INSERT INTO applicants(first_name, last_name, phone_number, email, application_code) VALUES(%s, %s, %s, %s, %s)", (first_name, last_name, phone_number, email, application_code))
        return True
    except Exception:
        print("Something wrong")


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
        cursor.execute("SELECT * FROM applicants")
        applicants_info = cursor.fetchall()
        return  applicants_info
    except Exception:
        print("Something wrong")


