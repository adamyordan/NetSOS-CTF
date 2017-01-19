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
import route

app = Flask(__name__)
cas = CAS(app, '/cas')
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
app.register_blueprint(route.route, url_prefix='/netsos-ctf/')

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

if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True)
