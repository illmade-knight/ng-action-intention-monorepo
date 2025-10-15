import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KeyClient } from '@ng-action-intention/sdk';
import { URN } from '@illmade-knight/action-intention-protos';
import { NG_CLIENTS_CONFIG } from './ng-clients.config';

@Injectable({ providedIn: 'root' })
export class AngularKeyClient implements KeyClient {
  private http = inject(HttpClient);
  private config = inject(NG_CLIENTS_CONFIG);
  private keyServiceUrl = this.config.keyServiceUrl;

  getKey(userId: URN): Promise<Uint8Array> {
    const url = `${this.keyServiceUrl}/keys/${userId.toString()}`;
    return firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' })
    ).then(buffer => new Uint8Array(buffer));
  }

  storeKey(userId: URN, key: Uint8Array): Promise<void> {
    const url = `${this.keyServiceUrl}/keys/${userId.toString()}`;
    return firstValueFrom(
      this.http.post<void>(url, key.buffer)
    );
  }
}
