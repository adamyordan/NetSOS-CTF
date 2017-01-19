import flask
import flask_cas
from flask import Flask, render_template, redirect, request, url_for
from flask_cas import CAS
from flask_cas import login_required
from flask_sqlalchemy import SQLAlchemy
import json
from functools import wraps
import requests
import flask_login

APP_ROOT = '/ctf'

app = Flask(__name__, static_url_path=APP_ROOT+'/static')
cas = CAS(app, APP_ROOT + '/cas')
db = SQLAlchemy(app)
app.secret_key = 'netsos-over-ristek'
app.config['CAS_SERVER'] = 'https://sso.ui.ac.id/' 
app.config['CAS_LOGIN_ROUTE'] = '/cas2/' 
app.config['CAS_LOGOUT_ROUTE'] = '/cas2/logout' 
app.config['CAS_VALIDATE_ROUTE'] = '/cas2/serviceValidate' 
app.config['CAS_AFTER_LOGIN'] = 'route_login_confirm'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./db/database.db'
app.config['SESSION_COOKIE_NAME'] = 'session_portal'
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User(db.Model, flask_login.UserMixin):
  id = db.Column(db.Integer, primary_key=True)
  username_ui = db.Column(db.String(80), unique=True)
  username = db.Column(db.String(80), unique=True)
  is_authenticated = True
  is_active = True
  is_anonymous = False

  def __init__(self, username_ui, username):
      self.username_ui = username_ui
      self.username = username

  def __repr__(self):
      return str(self.serialize())

  def serialize(self, credential=False, participations=True):
    val = {}
    val['id'] = self.id
    val['username'] = self.username
    val['is_anonymous'] = self.is_anonymous
    if participations:
      val['participations'] = list(map(lambda x: x.serialize(user=False), self.participations))
    if credential:
      val['username_ui'] = self.username_ui
    return val

  def get_id(self):
    return self.id

  @staticmethod
  def get_anonymous():
    user = User('-', '-')
    user.id = -1
    user.is_anonymous = True
    user.is_active = False
    user.is_authenticated = False
    return user

class Contest(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), unique=True)
  description = db.Column(db.String(80))
  active = db.Column(db.Boolean)
  url = db.Column(db.String(80))

  def __init__(self, name, description, active, url):
    self.name = name
    self.description = description
    self.active = active
    self.url = url

  def __repr__(self):
      return str(self.serialize())

  def serialize(self, participations=True):
    val = {}
    val['id'] = self.id
    val['name'] = self.name
    val['description'] = self.description
    val['active'] = self.active
    val['url'] = self.url
    if participations:
      val['participations'] = list(map(lambda x: x.serialize(contest=False), self.participations))
    return val

  def getStanding(self):
    if self.active:
      r = requests.get(getStandingUrl(self))
      raw_standing = r.json()['standings']
      standing = []
      for x in raw_standing:
        standing.append({'position': x['pos'], 'username': x['team'], 
          'score': x['score'], 'user_id': x['portal_id']});
      return standing 
    else:
      raw_standing = sorted(self.participations, key=lambda x: x.position)
      standing = []
      for x in raw_standing:
        print 
        standing.append({'position': x.position, 'username': x.user.username, 
          'score': x.point, 'user_id': x.user.id});
      return standing 

class Participation(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  user = db.relationship('User',
      backref=db.backref('participations', lazy='dynamic'))
  contest_id = db.Column(db.Integer, db.ForeignKey('contest.id'))
  contest = db.relationship('Contest',
      backref=db.backref('participations', lazy='dynamic'))
  point = db.Column(db.Integer)
  position = db.Column(db.Integer)
  
  def __init__(self, user, contest):
    self.user = user
    self.contest = contest

  def __repr__(self):
      return str(self.serialize())

  def serialize(self, user=True, contest=True):
    val = {}
    val['id'] = self.id
    val['point'] = self.point
    val['position'] = self.position
    if user and self.user:
      val['user'] = self.user.serialize(participations=False)
    if contest and self.contest:
      val['contest'] = self.contest.serialize(participations=False)
    return val

# flask-login
@login_manager.user_loader
def user_loader(id):
  user = User.query.filter_by(id=id).first()
  return user

@login_manager.request_loader
def request_loader(request):
  return

@login_manager.unauthorized_handler
def unauthorized_handler():
    return render_template('error.html', error='403 Unauthorized', next=url_for('route_root'))
# end flask-login

def getSecret():
  return 'netsos_over_ristek'

def getRegisterUrl(contest):
  return contest.url + '/api/register'

def getStandingUrl(contest):
  return contest.url + '/scores'

def getLoginUrl(contest):
  return contest.url + '/api/login'

def getUser():
  return flask_login.current_user

def errorJson(error):
  return flask.jsonify(ok=False, error=error)

@app.route(APP_ROOT + '/')
def route_root():
  if not getUser().is_anonymous:
    return redirect(url_for('route_login'))
  return render_template('index.html')

@app.route(APP_ROOT + '/home')
@flask_login.login_required
def route_dashboard():
  return render_template('dashboard.html')

@app.route(APP_ROOT + '/login')
def route_login():
  return flask_cas.login();

@app.route(APP_ROOT + '/login/confirm')
def route_login_confirm():
  if not cas.username:
    return redirect(url_for('route_login'))

  user = User.query.filter_by(username_ui=cas.username).first()
  if user:
    flask_login.login_user(user)
    return redirect(url_for('route_dashboard'));
  else:
    return redirect(url_for('route_register'));

@app.route(APP_ROOT + '/logout')
def route_logout():
  flask_login.logout_user()
  return redirect(url_for('route_root'));

@app.route(APP_ROOT + '/register', methods=['GET', 'POST'])
@flask_cas.login_required
def route_register():
  if not getUser().is_anonymous or User.query.filter_by(username_ui=cas.username).first():
    return redirect(url_for('route_dashboard'))

  if request.method == 'POST':
    if len(request.form['username']) >= 3 and len(request.form['username']) <= 15:
      user = User(cas.username, request.form['username'])
      db.session.add(user)
      db.session.commit()
      flask_login.login_user(user)
      return redirect(url_for('route_dashboard'))
    else:
      error = 'username is too short or too long'
      return render_template('register.html', error=error, cas = cas);
  else:
    return render_template('register.html', cas = cas);

@app.route(APP_ROOT + '/debug/cas')
@flask_login.login_required
def route_debug_cas():
  return flask.jsonify(**cas.attributes)

@app.route(APP_ROOT + '/api/contest/')
def route_contest():
  contests = Contest.query.all()
  return flask.jsonify(ok=True, data=list(map(lambda x: x.serialize(), contests)))

@app.route(APP_ROOT + '/api/contest/standing')
def route_contest_standing():
  if not request.args.get('contest_id'):
    return errorJson("'contest_id' not specified")
  contest = Contest.query.filter_by(id=request.args.get('contest_id')).first()
  return flask.jsonify(ok=True, data=contest.getStanding())

@app.route(APP_ROOT + '/api/contest/admin', methods=['POST'])
def route_contest_admin():
  if request.form.get('supersecret') != getSecret():
    return errorJson('not allowed')

  if not request.form.get('action'):
    return errorJson("'action' not specified")

  if request.form.get('action') == 'create':
    if not request.form.get('name'):
      return errorJson("'name' not specified")
    if not request.form.get('description'):
      return errorJson("'description' not specified")
    if not request.form.get('active'):
      return errorJson("'active' not specified")
    if not request.form.get('url'):
      return errorJson("'url' not specified")

    contest = Contest(
      request.form.get('name'), 
      request.form.get('description'), 
      bool(int(request.form.get('active'))), 
      request.form.get('url'), 
    )
    db.session.add(contest)
    db.session.commit()
    return flask.jsonify(ok=True, data=contest.serialize())

  if request.form.get('action') == 'update':
    if not request.form.get('id'):
      return errorJson("'id' not specified")

    contest_id = request.form.get('id')
    contest = Contest.query.filter_by(id=contest_id).first()
    if not contest:
      return errorJson('contest with id: ' + str(contest_id) + ' not found')

    if request.form.get('description'):
      contest.description = request.form.get('description')
    if request.form.get('name'):
      contest.name = request.form.get('name')
    if request.form.get('active'):
      contest.active = bool(int(request.form.get('active')))

    db.session.commit()
    return flask.jsonify(ok=True, data=contest.serialize())

  if request.form.get('action') == 'delete':
    if not request.form.get('id'):
      return errorJson("'id' not specified")
    if not request.form.get('name'):
      return errorJson("'name' not specified. Please input contest name for validation")

    contest_id = request.form.get('id')
    contest = Contest.query.filter_by(id=contest_id).first()
    if not contest:
      return errorJson('contest with id: ' + str(contest_id) + ' not found')

    db.session.delete(contest)
    db.session.commit()
    return flask.jsonify(ok=True)

  if request.form.get('action') == 'scrap':
    if not request.form.get('id'):
      return errorJson("'id' not specified")

    contest_id = request.form.get('id')
    contest = Contest.query.filter_by(id=contest_id).first()
    if not contest:
      return errorJson('contest with id: ' + str(contest_id) + ' not found')

    r = requests.get(getStandingUrl(contest))
    raw_standing = r.json()['standings']
    standing = []
    for x in raw_standing:
      user_id = x['portal_id']
      for participation in contest.participations:
        if participation.user and participation.user.id == user_id:
          participation.position = x['pos'];
          participation.point = x['score'];

    db.session.commit()
    return flask.jsonify(ok=True)

  return errorJson("'action' not recognized")

@app.route(APP_ROOT + '/api/contest/register', methods=['POST'])
@flask_login.login_required
def route_contest_register():
  user = getUser()
  if user.is_anonymous:
    # user = User.get_anonymous()
    return errorJson('user is not logged in')

  if request.form.get('contest_id'):

    contest_id = request.form.get('contest_id')
    contest = Contest.query.filter_by(id=contest_id).first()
    if not contest:
      return errorJson('contest not found')

    r = requests.post(getRegisterUrl(contest), data={
      'supersecret': getSecret(),
      'contest_id': contest_id, 
      'portal_id': user.id,
      'name': user.username,
      'email': user.username,
      'password': 'password123'
    })

    if not r.json()['ok']:
      return errorJson('registration refused: ' + str(r.json()['error']))

    participation = Participation(user, contest)
    user.participations.append(participation)
    contest.participations.append(participation)
    db.session.add(user)
    db.session.add(contest)
    db.session.add(participation)
    db.session.commit()

    return flask.jsonify(ok=True)

  else:
    return errorJson("'contest_id' not specified")

@app.route(APP_ROOT + '/api/contest/login', methods=['POST'])
@flask_login.login_required
def route_contest_login():
  user = getUser()
  if user.is_anonymous:
    # user = User.get_anonymous()
    return errorJson('user is not logged in')

  if request.form.get('contest_id'):

    contest_id = request.form.get('contest_id')
    contest = Contest.query.filter_by(id=contest_id).first()
    if not contest:
      return errorJson('contest not found')

    r = requests.post(getLoginUrl(contest), data={
      'supersecret': getSecret(),
      'contest_id': contest_id, 
      'name': user.username,
      'password': 'password123'
    })

    if not r.json()['ok']:
      return errorJson('login refused: ' + str(r.json()['error']))

    tmp = r.headers['Set-Cookie'].split('=',1)

    out = flask.jsonify(ok=True, setCookie=r.headers['set-cookie'])
    out.set_cookie(tmp[0], tmp[1])
    return out
    
    # return flask.jsonify(ok=True, setCookie=r.headers['set-cookie'])

  else:
    return errorJson("'contest_id' not specified")


@app.route(APP_ROOT + '/api/me')
@flask_login.login_required
def route_api_me():
  user = getUser()
  if (user.is_anonymous):
    return json.dumps(User.get_anonymous().serialize(credential=True))
  else:
    return json.dumps(user.serialize(credential=True))

@app.route(APP_ROOT + '/api/user/<id>')
@flask_login.login_required
def route_api_user(id):
  user = User.query.filter_by(id=id).first()
  if user:
    if user.id == getUser().id:
      return flask.jsonify(ok=True, data=user.serialize(credential=True))
    else:
      return flask.jsonify(ok=True, data=user.serialize(credential=False))
  else:
    return flask.jsonify(ok=False)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error='404 Not Found : ' + request.path, next=url_for('route_root'))

if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True, port=39001)
