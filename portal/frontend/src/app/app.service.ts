import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {
  url_root = '/ctf';

  url = {
    me: this.url_root + '/api/me',
    user: this.url_root + '/api/user/',
    contest: this.url_root + '/api/contest',
    participate: this.url_root + '/api/contest/register',
    loginContest: this.url_root + '/api/contest/login',
    contestStanding: this.url_root + '/api/contest/standing',
  };

  supersecret = 'netsos_over_ristek';

  constructor(private http: Http) {}

  getMe(): Observable<any> {
    return this.http.get(this.url.me).map((res: Response) => {
      let body = res.json();
      return body || { }
    });
  }

  getUser(id): Observable<any> {
    return this.http.get(this.url.user + id).map((res: Response) => {
      let body = res.json();
      return body.data || { }
    });
  }

  getContests(): Observable<any[]> {
    return this.http.get(this.url.contest).map((res: Response) => {
      let body = res.json();
      return body.data || { };
    });
  }

  getScoreboardData(contest): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('contest_id', contest.id);
    return this.http.get(this.url.contestStanding, {search: params}).map((res: Response) => {
      let body = res.json();
      return body.data || { }
    })
  }

  doParticipate(contest): Observable<any> {
    const formData = new FormData();
    formData.append('contest_id', contest.id);

    return this.http.post(this.url.participate, formData).map((res: Response) => {
      let body = res.json();
      return body || { };
    })
  }

  doLogin(contest): Observable<any> {
    const formData = new FormData();
    formData.append('contest_id', contest.id);
    
    return this.http.post(this.url.loginContest, formData).map((res: Response) => {
      let body = res.json();
      if (body && body.setCookie) {
        let sc: any[] = body.setCookie.split('; ');
        if (sc.length > 0) {
          let kv = sc[0].split('=');
          this.setCookie(sc[0], '', -1)
          this.setCookie(sc[0], sc[1], 1)
        }
      }
      return body || { };
    })
  }

  private setCookie(name: string, value: string, expireDays: number, path: string = this.url_root) {
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
  }

}