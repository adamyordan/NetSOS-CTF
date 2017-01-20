#!/bin/python
from app import db, User, Contest, Participation
db.drop_all()
db.create_all()

# user_adam = User('adam.jordan', 'seeker')
# user_wira = User('wira.abdillah', 'wiz4rd')
contest_1 = Contest('NetSOS Exam', 'NetSOS 2017 open recruitment exam', True, 'http://ristek.cs.ui.ac.id/ctf/playground', 1485993600, 1486674000)
#contest_2 = Contest('Eternal', 'Open all the time', True, 'http://192.168.0.103/eternal')
# part_adam_1 = Participation(user_adam, contest_1)
# part_wira_1 = Participation(user_wira, contest_1)

# db.session.add(user_adam)
# db.session.add(user_wira)
db.session.add(contest_1)
#db.session.add(contest_2)
# db.session.add(part_adam_1)
# db.session.add(part_wira_1)
db.session.commit()

# print User.query.all()
# print Contest.query.all()
# print Participation.query.all()
