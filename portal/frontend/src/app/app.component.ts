import { Component } from '@angular/core';
import { AppService } from './app.service';

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

  participate(contest): void {
    this.appService.doParticipate(contest).subscribe(data => {
      if (data.ok) {
        alert('ok');
      } else {
        alert('failed');
      }
      this.refreshContestsData();
    });
  }

  login(contest): void {
    this.appService.doLogin(contest).subscribe(data => {
      if (data.ok) {
        alert('ok')
      } else {
        alert('failed')
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
      this.appService.getUser(this.selectedUser).subscribe(data => this.selectedUser = data);
    }
  }

}
