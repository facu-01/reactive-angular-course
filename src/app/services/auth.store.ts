import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { User } from "../model/user";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private userSubject = new BehaviorSubject<User>(null);

  user$ = this.userSubject.asObservable();

  loggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.loggedIn$ = this.user$.pipe(map(Boolean));
    this.loadUser();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => this.userSubject.next(user)),
      tap((user) => {
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }

  loadUser() {
    const user = localStorage.getItem(AUTH_DATA);

    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }
}
