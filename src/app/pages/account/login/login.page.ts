import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { debounceTime, filter, Subject, tap } from 'rxjs';
import { UserService } from 'src/services/user/user.service';
import { AppBaseView } from 'src/shared/page';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends AppBaseView implements OnInit {
  login = { username: '', password: '' };
  showError = false;
  submitted = false;
  private logAction = new Subject();
  private logining = false;
  constructor(public userServ: UserService, public nav: NavController) {
    super();
    this.addClear(
      userServ.mineInfo$.subscribe((v) => {
        if (v) nav.navigateRoot('/');
      })
    );
  }
  ngOnInit() {
    this.addClear(
      this.logAction
        .pipe(
          debounceTime(100),
          filter(() => !this.logining),
          tap(() => (this.logining = true))
        )
        .subscribe(() => {
          this.userServ
            .login(this.login.username, this.login.password)
            .finally(() => (this.logining = false));
        })
    );
  }
  onLogin(form: NgForm) {
    this.showError = false;
    if (form.valid) {
      this.logAction.next(this.login);
    } else {
      this.showError = true;
    }
  }
}
