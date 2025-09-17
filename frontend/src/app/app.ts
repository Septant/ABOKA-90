import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HackService } from './services/hack.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Анализатор Волновой Объектов Класса Артефакт, модель 90';

  private hackService = inject(HackService);

  private buffer = '';
  private secretBrake = 'brakeitnow';
  private secretFix = 'fixitnow';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Берём только буквы/цифры
    if (event.key.length === 1) {
      this.buffer += event.key.toLowerCase();

      // Обрезаем, чтобы буфер не разрастался
      if (this.buffer.length > this.secretBrake.length) {
        this.buffer = this.buffer.slice(-this.secretBrake.length);
      }

      // Проверка
      if ([this.secretBrake, this.secretFix].includes(this.buffer)) {
        this.hackService.switchFix();
        this.buffer = ''; // сброс
      }
    }
  }

  dropDB() {
    this.hackService.dropDB();
  }
}
