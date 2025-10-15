import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { toJsonString } from '@bufbuild/protobuf';
import { RoutingClient } from '@ng-action-intention/sdk';
import {
  URN,
  SecureEnvelope,
  SecureEnvelopeListPb,
  secureEnvelopeToProto, // Using the helper
  secureEnvelopeFromProto, // Using the helper
  SecureEnvelopePbSchema
} from '@illmade-knight/action-intention-protos';
import { NG_CLIENTS_CONFIG } from './ng-clients.config';

@Injectable({ providedIn: 'root' })
export class AngularRoutingClient implements RoutingClient {
  private http = inject(HttpClient);
  private config = inject(NG_CLIENTS_CONFIG);
  private routingServiceUrl = this.config.routingServiceUrl;

  /**
   * Serializes an envelope to a protobuf JSON string using the helper and sends it.
   */
  send(envelope: SecureEnvelope): Promise<void> {
    const url = `${this.routingServiceUrl}/send`;
    // Use the helper function to create the protobuf message
    const protoEnvelope = secureEnvelopeToProto(envelope);
    const jsonPayload = toJsonString(SecureEnvelopePbSchema, protoEnvelope);
    return firstValueFrom(
      this.http.post<void>(url, jsonPayload, {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  /**
   * Receives a list of messages and deserializes them using the helper.
   */
  receive(user: URN): Promise<SecureEnvelope[]> {
    const url = `${this.routingServiceUrl}/receive/${user.toString()}`;
    return firstValueFrom(
      this.http.get<SecureEnvelopeListPb>(url).pipe(
        // Use the helper function to convert each protobuf message back
        map(protoResponse => protoResponse.envelopes.map(secureEnvelopeFromProto))
      )
    );
  }
}
