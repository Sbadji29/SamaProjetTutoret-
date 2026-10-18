import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() filiere: string = 'Master Informatique';
  @Input() module: string = 'Projets Tutorés';
  @Input() session: string = 'Session Principale';
  @Input() hasNotification: boolean = true;
  @Input() userAvatar: string =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces';
  @Input() userName: string = 'Camille Laurent';
}
