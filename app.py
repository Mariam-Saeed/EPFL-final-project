import bcrypt, uuid
from flask import Flask, json, redirect, request, session, render_template
from flask_session import Session
from email_validator import validate_email, EmailNotValidError

app = Flask('app')
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# User Class
class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.id = uuid.uuid4()

    # hash the password to store it
    def hash_password(self):
        # converting password to array of bytes 
        bytes = self.password.encode('utf-8') 
        # generating the salt 
        salt = bcrypt.gensalt() 
        # Hashing the password 
        hash = bcrypt.hashpw(bytes, salt) 
        return hash
    
    def format_data(self, hashed_password):
        users_list = [] 
        data = {
            "name": self.name,
            "email": self.email,
            "id": self.id,
            "password": hashed_password.decode('utf-8'),
            "phone": '',
            "address": ''        
        }

        # Read JSON file
        with open('usersDB.json') as file:
            users_list = json.load(file)
            users_list.append(data)
            print(type(users_list))

        with open("usersDB.json", "w") as file:
            file.seek(0)
            json.dump(users_list, file)

# check user password with the passwords in database
def check_password(user_password, hash):
    # encoding user password 
    user_bytes = user_password.encode('utf-8') 
    # encoding saved paasword
    saved_password = hash.encode('utf-8')
    # checking password 
    result = bcrypt.checkpw(user_bytes, saved_password) 
    return result

# check if the email inputed is valid and return error if the email is invalid
def email_validation(email):
    try:
        # Check that the email address is valid. Turn on check_deliverability
        #for first-time validations like on account creation pages (but not
        # login pages).
        emailinfo = validate_email(email, check_deliverability=False)        
        # After this point, use only the normalized form of the email address, especially before going to a database query.
        email = emailinfo.normalized
        return [True, email]

    except EmailNotValidError as e:
        return [False, str(e)]

@app.route('/', methods=['GET', 'POST'])
def signup():
    if(request.method == 'POST'):
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm-password')

        if(not email or not password or not name):
            return render_template('signup.html', error = 'Please enter email, password and username') 
        
        email_valid = email_validation(email)
        if(not email_valid[0]):
            return render_template('signup.html', error = email_valid[1])
                
        email = email_valid[1]

        #check if the password and confirmation password are equall
        if(password != confirm_password):
            return render_template('signup.html', error = 'Passwords not matched')
        
        new_user = User(name, email, password)
        hashed_password = new_user.hash_password()
        new_user.format_data(hashed_password)
        session['user'] = new_user.id
        return redirect('/home')
    
    else:
        if(session.get('user')):
            return redirect('/home')
        
        return render_template('signup.html')

@app.route('/home')
def homepage():
    if not session.get('user'):
        return redirect('/login')
    return render_template('homepage.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    # # forget any session
    # session.clear()
    if (request.method == 'POST'):
        email = request.form.get('email')
        password = request.form.get('password')
        users_list = []
        with open('usersDB.json') as file:
            users_list = json.load(file)

        if(not email or not password):
            return render_template('login.html', error = 'Please enter email and password') 
        
        # check if email is valid
        email_valid = email_validation(email)
        if(not email_valid[0]):
            return render_template('login.html', error = email_valid[1])
                
        email = email_valid[1]

        for user in users_list:
            if(email == user["email"] and check_password(password, user["password"])):
                # remember the user using session
                session['user'] = user["id"]
                return redirect('/home')
        return render_template('login.html', error = 'Invalid email or password' ) 
    else:
        if(session.get('user')):
            return redirect('/home')

        return render_template('login.html')
    

@app.route('/logout')
def logout():
    # logout the user by clearing the session
    session.clear()
    return redirect('/login')


@app.route('/wishlist')
def wishlist():
    return render_template('wishlist.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/orders')
def orders():
    return render_template('orders.html')

@app.route('/profile')
def profile():
    name = ''
    email = ''
    phone = ''
    address = ''
    with open('usersDB.json') as file:
        users_list = json.load(file)
        for user in users_list:
            if (user['id'] == str(session['user'])):
                name = user['name']
                email = user['email']
                phone = user['phone']
                address = user ['address']
        
    return render_template('profile.html', name = name, email= email, phone = phone, address = address)

@app.route('/info', methods=['GET', 'POST'])
def info():
    users_list = []
    user_phone = ''
    user_address = ''
    with open('usersDB.json') as file:
        users_list = json.load(file)

    for user in users_list:
        if (user['id'] == str(session['user'])):
            user_phone = user['phone']
            user_address = user['address'] 

    if(request.method == 'POST'):
        phone_number = request.form.get('phone')
        address = request.form.get('address')

        if(not phone_number or not address):
            return render_template('info.html', error = 'Please enter phone number and address') 

        with open('usersDB.json') as file:
            users_list = json.load(file)

        if(phone_number != user_phone or address != user_address):
            for user in users_list:
                if (user['id'] == str(session['user'])):
                    user['phone'] = phone_number
                    user['address'] = address

            with open("usersDB.json", "w") as file:
                file.seek(0)
                json.dump(users_list, file)

        return render_template('orders.html')
    else:
        return render_template('info.html', phone = user_phone, address = user_address)