import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SujetItem } from './sujet.model';

@Component({
  selector: 'app-sujet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sujet.html',
  styleUrl: './sujet.css',
})
export class Sujet {
  @Input() data?: SujetItem;
  @Output() selectSujet = new EventEmitter<SujetItem>();

  onSelect(): void {
    if (this.data) {
      this.selectSujet.emit(this.data);
    }
  }
}
