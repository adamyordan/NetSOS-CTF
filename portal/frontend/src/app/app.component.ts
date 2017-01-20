import { Component } from '@angular/core';
import { AppService } from './app.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  me: any;
  contests: any[] = [];
  oldContests: any[] = [];
  selectedContest: any;
  selectedRoute: string = 'contest';
  selectedUserId: any;
  selectedUser: number;

  constructor(private appService: AppService) {
    this.refreshContestsData();
    this.refreshMeData();

    setInterval(() => {
      this.refreshContestsData();
      this.refreshMeData();
    }, 10000);
  }

  refreshContestsData(): void {
    this.appService.getContests().subscribe((contests: any[]) => {
      this.contests = contests.filter(c => c.active); 
      this.oldContests = contests.filter(c => !c.active); 
      if (this.selectedContest) {
        this.selectedContest = contests.find(c => c.id = this.selectedContest.id);
        this.appService.getScoreboardData(this.selectedContest).subscribe(data => {
          this.selectedContest['scoreboardData'] = data;
        })
      }    
    });
  }

  refreshMeData(): void {
    this.appService.getMe().subscribe((user: any) => this.me = user);
  }

  isParticipating(user, contest): boolean {
    if (!contest.participations) return false;
    const participationInstance = contest.participations.find(p => p.user.id == user.id);
    return participationInstance != null;
  }

  selectContest(contest): void {
    this.selectedContest = contest;
    this.appService.getScoreboardData(this.selectedContest).subscribe(data => {
      this.selectedContest['scoreboardData'] = data;
    })
  }

  participate(contest, password): void {
    swal({
      title: 'Confirm participation?',
      text: "You will be registered to participate in this contest",
      type: 'question',
      showCancelButton: true,
    }).then(() => {
      swal({
        title: 'Registering participation',
        type: 'info',
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      });
      this.appService.doParticipate(contest, password).subscribe(data => {
        if (data.ok) {
          swal('Participation granted', 'Your participation has been registered', 'success');
        } else {
          if (data['usePassword']) {
            swal({
              title: 'Enter participation key',
              input: 'password',
            }).then((entered_password) => {
              swal({
                title: 'Registering participation',
                type: 'info',
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false
              });
              this.appService.doParticipate(contest, entered_password).subscribe(data => {
                if (data.ok) {
                  swal('Participation granted', 'Your participation has been registered', 'success');
                } else {
                  swal('Participation refused', 'Your participation has refused due to some reasons', 'error');
                }               
              })
            })
          } else {
            swal('Participation refused', 'Your participation has refused due to some reasons', 'error');
          }
        }
        this.refreshContestsData();
      });
    });
  }

  login(contest): void {
    swal({
      title: 'Logging you in',
      type: 'info',
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    this.appService.doLogin(contest).subscribe(data => {
      if (data.ok) {
        swal('Login granted', 'You have been logged in to the contest', 'success');
      } else {
        swal('Login refused', 'Login refused due to some reasons', 'error');
      }
    })
  }

  go(contest): void {
    window.open(contest.url);
  }

  routeToProfile(userId=null): void {
    if (userId == null && this.me) {
      this.selectedRoute = 'profile';
      this.selectedUserId = this.me.id;
    } else {
      this.selectedRoute = 'profile';
      this.selectedUserId = userId;
    }

    if (this.selectedUserId != null) {
      this.appService.getUser(this.selectedUserId).subscribe(data => this.selectedUser = data);
    }
  }

}
