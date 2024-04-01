import * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  userCanWrite: Record<string, boolean> = {};
  async onConnect(conn: Party.Connection) {
    const params = new URLSearchParams(conn.uri);
    const password = params.get("password");
    const isYjs = params.get("yjs") == "true";
    let readOnly = false;

    const roomPassword = await this.party.storage.get("password");

    if (roomPassword && password !== roomPassword) {
      readOnly = true;
    }
    if (!readOnly) {
      this.userCanWrite[conn.id] = true;
    }

    conn.send(
      JSON.stringify({
        event: "permission",
        data: {
          hasPermission: !readOnly,
          isLocked: typeof roomPassword === "string",
        },
      })
    );

    if (isYjs) {
      return onConnect(conn, this.party, {
        // ...options
        readOnly,
        persist: {
          mode: "snapshot",
        },
      });
    } else {
    }
  }
  async onDisconnect(conn: Party.Connection) {
    delete this.userCanWrite[conn.id];
  }
  async onMessage(
    message: string | ArrayBuffer | ArrayBufferView,
    sender: Party.Connection<unknown>
  ): Promise<void> {
    // Handle messages

    // handle unlock
    if (typeof message === "string") {
      const data = JSON.parse(message);
      if (data.event === "unlock" && typeof data.data === "string") {
        // check password
        const roomPassword = await this.party.storage.get("password");

        if (roomPassword !== data.data) {
          return sender.send(
            JSON.stringify({
              event: "toast",
              data: "Invalid password",
            })
          );
        }

        if (typeof roomPassword === "string") {
          this.userCanWrite[sender.id] = true;
          sender.send(
            JSON.stringify({
              event: "permission",
              data: {
                hasPermission: true,
                isLocked: true,
              },
            })
          );
          sender.send(
            JSON.stringify({
              event: "refresh",
            })
          );
        }
      }
      //  update the password
      if (data.event === "update-password") {
        if (!this.userCanWrite[sender.id]) {
          return sender.send(
            JSON.stringify({
              event: "toast",
              data: "You don't have permission to update the password",
            })
          );
        }
        // if its empty, remove the password
        if (data.data === "") {
          await this.party.storage.delete("password");
          this.party.broadcast(
            JSON.stringify({
              event: "refresh",
            })
          );
          return;
        }
        this.party.storage.put("password", data.data);
        this.party.broadcast(
          JSON.stringify({
            event: "refresh",
          })
        );
      }
    }
  }
}
