import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {ErrorService} from './components/shared/service/error.service';
import {ErrorModalComponent} from './components/shared/modal/error-modal/error-modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Deal Capture';

  errorService = inject(ErrorService);
  error = this.errorService.error;
}
