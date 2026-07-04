import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageTransferService } from './core/services/storage-transfer.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app');
  @ViewChild('appSidenav') appSidenav?: MatSidenav;

  constructor(
    private storageTransferService: StorageTransferService,
    private snackBar: MatSnackBar
  ) {}

  toggleMenu(): void {
    this.appSidenav?.toggle();
  }

  closeMenu(): void {
    this.appSidenav?.close();
  }

  exportStorage(): void {
    this.storageTransferService.exportToJsonFile();
    this.showSnackbar('Exportacion completada.');
  }

  importStorageFromFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const result = this.storageTransferService.importFromJsonText(text);

      if (!result.ok) {
        this.showSnackbar(result.error);
        input.value = '';
        return;
      }

      this.showSnackbar('Importacion completada. Recargando...');
      input.value = '';
      window.setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    reader.onerror = () => {
      this.showSnackbar('No se pudo leer el fichero seleccionado.');
      input.value = '';
    };

    reader.readAsText(file);
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
