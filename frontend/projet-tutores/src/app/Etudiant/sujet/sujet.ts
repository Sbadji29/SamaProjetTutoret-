import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SujetItem } from './sujet.model';

@Component({
  selector: 'app-sujet',
  imports: [CommonModule],
  templateUrl: './sujet.html',
  styleUrl: './sujet.css',
})
export class Sujet {
  @Input() data?: SujetItem;
}
