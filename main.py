import data_manager
from flask import Flask, render_template, request, redirect

UPLOAD_FOLDER = 'static/user_images'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# menu data for quick links changing
MENU_PAGES = {'mentors_names_lastnames': ('mentors_names_lastnames.html', 'Mentors names and lastnames'),
              'miskolc_mentors_nicknames': ('miskolc_mentors_nicknames.html', 'Miskolc mentors nicknames'),
              'carols_fullname_number': ('carols_fullname_number.html', "Carol's full name and phone nubmer"),
              'another_girls_fullname_number': (
                  'another_girls__fullname_number.html', "Another girl's full name and phone nubmer"),
              'add_new_applicant': ('add_new_applicant', 'add_new_applicant.html', 'Add new applicant',),
              'applicant_info': ('applicant_info.html', 'Applicant info'),
              'applicants_info': ('applicants_info', 'applicants_info.html', 'Applicants info'),
              'applicant_delete': ('applicant_delete', 'applicant_delete.html', 'Delete the applicant'),
              'applicant_update': ('applicant_update', 'applicant_update.html', 'Update info about an applicant'),
              'mentors': ('mentors', 'mentors.html', 'Mentors and schools page'),
              'all-school': ('all-school', 'all-school.html', 'All school page'),
              'mentors-by-country': ('mentors-by-country', 'mentors-by-country.html', 'Mentors by country'),
              'contacts': ('contacts', 'contacts.html', 'Contacts'),
              'applicants': ('applicants', 'applicants.html','Applicants page'),
              'applicants-and-mentors': ('applicants-and-mentors', 'applicants-and-mentors.html', 'Applicants and mentors')
              }


# The main index page
@app.route('/')
def index():
    return render_template('index.html', MENU_PAGES=MENU_PAGES)


# 1. Mentors names and lastnames
@app.route('/mentors_names_lastnames')
def mentors_names_lastnames():
    mentors_names_lastnames = data_manager.get_mentors_names_lastnames()

    return render_template(MENU_PAGES['mentors_names_lastnames'][0], mentors_names_lastnames=mentors_names_lastnames)


# 2. Nicknames all mentors working at Miskolc
@app.route('/miskolc_mentors_nicknames')
def miskolc_mentors_nicknames():
    miskolc_mentors_nicknames = data_manager.miskolc_mentors_nicknames()

    return render_template(MENU_PAGES['miskolc_mentors_nicknames'][0],
                           miskolc_mentors_nicknames=miskolc_mentors_nicknames)


# 3. Carol's fullname and phone number
@app.route('/carols_fullname_number')
def carols_fullname_number():
    carols_fullname_and_number = data_manager.carols_fullname_number()

    return render_template(MENU_PAGES['carols_fullname_number'][0],
                           carols_fullname_and_number=carols_fullname_and_number)


# 4. Another girl's fullname and phone number
@app.route('/another_girls_fullname_number')
def another_girls_fullname_number():
    another_girls_fullname_number = data_manager.another_girls_fullname_number()

    return render_template(MENU_PAGES['another_girls_fullname_number'][0],
                           another_girls_fullname_number=another_girls_fullname_number)


# 5.1 Add new applicant
@app.route('/add_new_applicant', methods=['GET', 'POST'])
def add_new_applicant():
    if request.method == "POST":
        data_manager.add_new_applicant(request.form['first_name'], request.form['last_name'], request.form['phone_number'],
                                       request.form['email'], request.form['application_code'], request, app)
        application_code = request.form['application_code']
        return redirect(f'/applicant_info/{application_code}')
        # return render_template(MENU_PAGES['applicant_info'][0],application_code=application_code)
    else:
        return render_template(MENU_PAGES['add_new_applicant'][1])


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
@app.route('/applicant_delete')
@app.route('/applicant_delete/<app_id>')
def delete_applicant(app_id=0):
    data_manager.delete_applicant(app_id)

    return redirect('/applicants_info')


# 8. Update an applicants information
@app.route('/applicant_update', methods=['GET', 'POST'])
@app.route('/applicant_update/<app_id>', methods=['GET', 'POST'])
def update_applicant(app_id=0):
    if request.method == "POST":
        data_manager.update_applicant_information(request.form['first_name'], request.form['last_name'],
                                                  request.form['phone_number'], request.form['email'],
                                                  request.form['application_code'], request.form['id'])
        return redirect('applicants_info')
    else:
        applicant_info_by_id = data_manager.get_applicant_info_by_id(app_id)
        return render_template(MENU_PAGES['applicant_update'][1], applicant_info_by_id=applicant_info_by_id,
                               MENU_PAGES=MENU_PAGES)

# 9. Mentors and schools page
@app.route('/mentors')
def mentors():
    mentors_and_schools_info = data_manager.mentors_and_schools_info()

    return render_template(MENU_PAGES['mentors'][1], mentors_and_schools_info=mentors_and_schools_info)

# 10. All schools page
@app.route('/all-school')
def all_school():
    all_school_info = data_manager.all_school_info()

    return render_template(MENU_PAGES['all-school'][1], all_school_info=all_school_info)

# 11. Number of mentors in a country
@app.route('/mentors_by_country')
def mentors_by_country():
    mentors_by_country = data_manager.mentors_by_country()

    return render_template(MENU_PAGES['mentors-by-country'][1], mentors_by_country=mentors_by_country)

# 12. School contacts
@app.route('/contacts')
def school_contacts():
    school_contacts = data_manager.school_contacts()

    return render_template(MENU_PAGES['contacts'][1], school_contacts=school_contacts)

# 13. Applicants
@app.route('/applicants')
def applicants():
    applicants_info = data_manager.applicants()

    return render_template(MENU_PAGES['applicants'][1], applicants_info=applicants_info)

# 14. Applicants and mentors
@app.route('/applicants-and-mentors ')
def applicants_and_mentors():
    applicants_and_mentors_info = data_manager.applicants_and_mentors()

    return render_template(MENU_PAGES['applicants-and-mentors'][1], applicants_and_mentors_info=applicants_and_mentors_info)


if __name__ == '__main__':
    app.run(debug=True)
