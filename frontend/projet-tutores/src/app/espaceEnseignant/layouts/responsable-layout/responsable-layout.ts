
import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-responsable-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './responsable-layout.html',
  styleUrl: './responsable-layout.css'
})
export class ResponsableLayoutComponent {}
