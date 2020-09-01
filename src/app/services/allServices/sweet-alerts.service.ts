import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertsService {
  successAlert(title) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  errorAlert(title, text) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
    });
  }
}
