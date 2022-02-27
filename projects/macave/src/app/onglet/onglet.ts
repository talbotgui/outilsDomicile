import { Component, Input } from '@angular/core';

@Component({ selector: 'app-onglet', templateUrl: './onglet.html', styleUrls: [] })
export class OngletComponent {
    @Input() public tag = '';
}
