import data_manager
from flask import Flask, render_template, request, redirect

app = Flask(__name__)

# menu data for quick links changing
MENU_PAGES = {'mentors_names_lastnames':('mentors_names_lastnames.html', 'Mentors names and lastnames'),
              'miskolc_mentors_nicknames':('miskolc_mentors_nicknames.html', 'Miskolc mentors nicknames'),
              'carols_fullname_number':('carols_fullname_number.html', "Carol's full name and phone nubmer"),
              'another_girls_fullname_number':('another_girls__fullname_number.html', "Another girl's full name and phone nubmer"),
              'add_new_applicant':('add_new_applicant.html', 'Add new applicant',),
              'applicant_info':('applicant_info.html', 'Applicant info'),
              'applicants_info':('applicants_info', 'applicants_info.html', 'Applicants info'),
              'applicant_delete':('applicant_delete','applicant_delete.html', 'Delete the applicant'),
              'applicant_update':('applicant_update','applicant_update.html', 'Update info about an applicant')
              }


# The main index page
@app.route('/')
def index():
    return render_template('index.html', MENU_PAGES=MENU_PAGES)

# 1. Mentors names and lastnames
@app.route('/mentors_names_lastnames')
def mentors_names_lastnames():
    mentors_names_lastnames = data_manager.get_mentors_names_lastnames()

    return render_template(MENU_PAGES['mentors_names_lastnames'][0], mentors_names_lastnames=mentors_names_lastnames)\

# 2. Nicknames all mentors working at Miskolc
@app.route('/miskolc_mentors_nicknames')
def miskolc_mentors_nicknames():
    miskolc_mentors_nicknames = data_manager.miskolc_mentors_nicknames()

    return render_template(MENU_PAGES['miskolc_mentors_nicknames'][0], miskolc_mentors_nicknames=miskolc_mentors_nicknames)\

# 3. Carol's fullname and phone number
@app.route('/carols_fullname_number')
def carols_fullname_number():
    carols_fullname_and_number = data_manager.carols_fullname_number()

    return render_template(MENU_PAGES['carols_fullname_number'][0], carols_fullname_and_number=carols_fullname_and_number)


# 4. Another girl's fullname and phone number
@app.route('/another_girls_fullname_number')
def another_girls_fullname_number():
    another_girls_fullname_number = data_manager.another_girls_fullname_number()

    return render_template(MENU_PAGES['another_girls_fullname_number'][0], another_girls_fullname_number=another_girls_fullname_number)

# 5.1 Add new applicant
@app.route('/add_new_applicant', methods=['GET', 'POST'])
def add_new_applicant():
    if request.method == "POST":
        data_manager.add_new_applicant(request.form['first_name'], request.form['last_name'], request.form['phone_number'],
                                       request.form['email'], request.form['application_code'])
        application_code = request.form['application_code']
        return redirect (f'/applicant_info/{application_code}')
        # return render_template(MENU_PAGES['applicant_info'][0],application_code=application_code)
    else:
        return render_template(MENU_PAGES['add_new_applicant'][0])

# 5.2 Display recently added applicant
@app.route('/applicant_info')
@app.route('/applicant_info/<int:application_code>')
def applicant_info(application_code=0):
    applicant_info = data_manager.get_applicant_info(application_code=application_code)

    return render_template(MENU_PAGES['applicant_info'][0], applicant_info=applicant_info)

# 6. Display all applicants info
@app.route('/applicants_info')
def applicants_info():
    applicants_info = data_manager.get_applicants_info()

    return render_template(MENU_PAGES['applicants_info'][1], applicants_info=applicants_info, MENU_PAGES=MENU_PAGES)

# 7. Delete applicant from table
@app.route('/applicant_delete/<int:id>')
def delete_applicant(id=0):
    return render_template(MENU_PAGES['applicant_delete'][1])

# 8. Update an applicants information
@app.route('/applicant_update', methods=['GET', 'POST'])
@app.route('/applicant_update/<int:id>')
def update_applicant(id=0):
    if request.method == "POST":
        return redirect(MENU_PAGES['applicants_info'][0])
    else:
        applicant_info_by_id = data_manager.get_applicant_info_by_id(id)
        return render_template(MENU_PAGES['applicant_update'][1], applicant_info_by_id=applicant_info_by_id)

if __name__ == '__main__':
    app.run(debug=True)
