import * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  async onConnect(conn: Party.Connection) {
    const params = new URLSearchParams(conn.uri);
    const password = params.get("password");
    const isYjs = params.get("yjs") == "true";
    let readOnly = false;

    const roomPassword = await this.party.storage.get("password");
    console.log(roomPassword, password);

    if (roomPassword && password !== roomPassword) {
      readOnly = true;
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
  async onMessage(
    message: string | ArrayBuffer | ArrayBufferView,
    sender: Party.Connection<unknown>
  ): Promise<void> {
    // Handle messages

    // handle unlock
    if (typeof message === "string") {
      const data = JSON.parse(message);
      console.log(data);

      if (data.event === "unlock" && typeof data.data === "string") {
        // check password
        const roomPassword = await this.party.storage.get("password");
        console.log(roomPassword, data.data);

        if (typeof roomPassword === "string" && roomPassword === data.data) {
          console.log(`Unlocking the room for ${sender.id}`);
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
      // handle lock
      if (data.event === "lock") {
        const roomPassword = await this.party.storage.get("password");
        // check if password is already set
        if (typeof roomPassword === "string") {
          return;
        }
        // set password
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
