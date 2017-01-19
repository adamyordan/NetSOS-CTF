from flask import current_app as app, render_template, request, redirect, jsonify, url_for, Blueprint

route = Blueprint('route', __name__)

@app.route('/')
def route_root():
  if not getUser().is_anonymous:
    return redirect(url_for('route_login'))
  return render_template('index.html')

@app.route('/home')
@flask_login.login_required
def route_dashboard():
  return render_template('dashboard.html')

@app.route('/login')
def route_login():
  return flask_cas.login();

@app.route('/login/confirm')
def route_login_confirm():
  if not cas.username:
    return redirect(url_for('route_login'))

  user = User.query.filter_by(username_ui=cas.username).first()
  if user:
    flask_login.login_user(user)
    return redirect(url_for('route_dashboard'));
  else:
    return redirect(url_for('route_register'));

@app.route('/logout')
def route_logout():
  flask_login.logout_user()
  return redirect(url_for('route_root'));

@app.route('/register', methods=['GET', 'POST'])
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

@app.route('/debug/cas')
@flask_login.login_required
def route_debug_cas():
  return flask.jsonify(**cas.attributes)

@app.route('/api/contest/')
def route_contest():
  contests = Contest.query.all()
  return flask.jsonify(ok=True, data=list(map(lambda x: x.serialize(), contests)))

@app.route('/api/contest/standing')
def route_contest_standing():
  if not request.args.get('contest_id'):
    return errorJson("'contest_id' not specified")
  contest = Contest.query.filter_by(id=request.args.get('contest_id')).first()
  return flask.jsonify(ok=True, data=contest.getStanding())

@app.route('/api/contest/admin', methods=['POST'])
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

@app.route('/api/contest/register', methods=['POST'])
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

@app.route('/api/contest/login', methods=['POST'])
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

    print r.headers

    return flask.jsonify(ok=True, setCookie=r.headers['set-cookie'])

  else:
    return errorJson("'contest_id' not specified")


@app.route('/api/me')
@flask_login.login_required
def route_api_me():
  user = getUser()
  if (user.is_anonymous):
    return json.dumps(User.get_anonymous().serialize(credential=True))
  else:
    return json.dumps(user.serialize(credential=True))

@app.route('/api/user/<id>')
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
    return render_template('error.html', error='404 Not Found', next=url_for('route_root'))
