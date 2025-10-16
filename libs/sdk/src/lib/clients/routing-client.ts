import type {SecureEnvelope, URN} from "@illmade-knight/action-intention-protos";
/**
 * Defines the contract for a client that communicates with the go-routing-service.
 */
export interface RoutingClient {
  /**
   * Dispatches a SecureEnvelope for delivery.
   * @param envelope The envelope to send.
   */
  send(envelope: SecureEnvelope): Promise<void>;

  receive(userId: URN): Promise<SecureEnvelope[]>;
}
