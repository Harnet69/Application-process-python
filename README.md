# application-process-python
Web and SQL with Python - Application process assignment - Basic SQL


Assignment: Application process - Basic SQL
Handling the application process at Codecool has always been a tedious task. Finally the HR department figured out that using only Python and long lists is a no-brainer if they want to get information quickly. To improve on data management, they collaborate with you to test out something they just heard about: "databases".

The exercise
Luckily they managed to assemble a database, which can be described by the Entity-Relationship Diagram below:

application process assignment.png

They need your help to to write a Flask application which runs and prints queries on this database (you can use your local PostgreSQL database as they provided sample data but you should only turn in your program's git repository url - as before - because they just change the credentials and use the program on their central database).

Preparation
Prepare the database with psql
You can find the sql file with the sample data in the data folder in the git repo linked below. Clone it, switch to that folder in terminal and start psql in that folder with the command:

[terminal]
psql
If you gave the same name for your PostgreSQL role as your linux user login name, there is no need to write in passwords or anything, psql just starts and you can interact with your database.

We suggest to create a new database for this application:

1. With the \l command you can list the existing databases if you would like

2. With CREATE DATABASE here_comes_your_creative_db_name; sql command you can create a new database. If you run now \l then you will see this one in the list

3. You have to define which database you work on. To step over to your new db you can run this psql command: \connect here_comes_your_creative_db_name

4. To put the data into your database, type the following into the psql prompt: \i application_process_sample_data.sql (if you are in a different folder than the file is then you can define a relative or absolute path in the command)

The queries
The HR department wants answers to the following questions:

Write a query that returns the 2 name columns of the mentors table. columns: firstname, last_name_
Write a query that returns the nick_name-s of all mentors working at Miskolc. column: nickname_
We had interview with an applicant, some Carol. We don't remember her name, but she left her hat at the school. We want to call her to give her back her hat. To look professional, we also need her full name when she answers the phone (for her full_name, you want to include a concatenation into your query, to get her full_name, like: "Carol Something" instead of having her name in 2 different columns in the result. This columns should be called: full_name). columns: fullname, phone_number_
We called Carol, and she said it's not her hat. It belongs to another girl, who went to the famous Adipiscingenimmi University. You should write a query to get the same informations like with Carol, but for this other girl. The only thing we know about her is her school e-mail address ending: '@adipiscingenimmi.edu'. columns: fullname, phone_number_
After we returned the hat, a new applicant appeared at the school, and he wants to get into the application process. His name is Markus Schaffarzyk, has a number: 003620/725-2666 and e-mail address: djnovus@groovecoverage.com Our generator gave him the following application code: 54823
After INSERTing the data, write a SELECT query, that returns with all the columns of this applicant! (use the unique application code for your condition!)

Jemima Foreman, an applicant called us, that her phone number changed to: 003670/223-7459 Write an UPDATE query, that changes this data in the database for this applicant. Also, write a SELECT query, that checks the phone_number column of this applicant. Use both of her name parts in the conditions!
Arsenio, an applicant called us, that he and his friend applied to Codecool. They both want to cancel the process, because they got an investor for the site they run: mauriseu.net
Write DELETE query to remove all the applicants, who applied with emails for this domain (e-mail address has this domain after the @ sign).

You need to extend the Flask application (which you will find in the classroom repo) with some simple menu, where each menu point answers one question (or does what the question asks) from the above list. If the question is to print out some table, please print it out in some readable way (e.g. different rows in a table or in a list).

CSS part
Your task here is to create a special design for the Flask app. Of course you don't have to create such beautiful designs with lots of images and artwork, the purpose of the task is to practice the newly acquired CSS knowledge.

You can use the already created main.css file and create a design where you use at least the following CSS selectors:

body, h1, footer
id selector
few class selectors
selector which selects tags inside another tag
selector which changes different elements at once (for this you can use comma as a separator)
Please use at least these properties while altering the design:

font-family, color, background-color, text-align
padding, margin, width, height, top, left
display, position
Remember, the goal is to practice CSS, so we don't require you to spend tens of hours to create a wonderful design, but if you want to, you can unleash your inner creativity dragon just make sure you do that after everything else :)

Interesting parts to check in the code:

1. In the templates we used template inheritance: we included another template in a template and we extended the layout templates in some template. These techniques help to avoid code duplication in the HTML code

2. In the layout.html template we import the design CSS file. Check how we did it using url_for and putting the css file into the 'static' folder.


