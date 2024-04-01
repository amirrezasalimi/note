import { useEditor } from "@tiptap/react";
import { useLocalStorage, useLocation } from "react-use";
import Typography from "@tiptap/extension-typography";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as awarenessProtocol from "y-protocols/awareness.js";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import PartySocket from "partysocket";

const host = "https://party.amirrezasalimi.partykit.dev";
// make a unique color with name
const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

const userColor = (name: string) => {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

const useNote = () => {
  // read path
  const loc = useLocation();
  const noteId = loc.href?.split("/").pop();

  // user
  const [name, setName] = useLocalStorage("name");
  const [password, setPassword] = useLocalStorage<string | null>(
    `note-${noteId}-password`,
    null
  );
  const [userId, setUserId] = useLocalStorage(
    "userId",
    Math.random().toString(36).substring(7)
  );
  const [isLocked, setIsLocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [status, setStatus] = useState("loading");

  // init
  const [ydoc, provider, ws] = useMemo(() => {
    const ydoc = new Y.Doc();

    const provider = new YPartyKitProvider(host, `note-${noteId}`, ydoc, {
      awareness: new awarenessProtocol.Awareness(ydoc),
      params: {
        yjs: "true",
        password,
      } as any,
    });
    provider.on("status", (e: { status: string }) => {
      setStatus(e.status);
    });
    const ws = new PartySocket({
      host,
      room: `note-${noteId}`,
      query: {
        password,
      },
    });
    return [ydoc, provider, ws];
  }, [noteId]);
  useEffect(() => {
    return () => {
      provider.destroy();
      provider.disconnect();
      ws.close();
      window.location.reload();
    };
  }, [noteId]);
  const wsEvent = (event: string, data: any) =>
    ws.send(JSON.stringify({ event, data }));
  // editor

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Document,
      Paragraph,
      Text,
      Image,
      Dropcursor,
      Typography,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "w-full h-full px-4 md:p-0 prose prose-sm sm:prose lg:prose-lg xl:prose focus:outline-none",
      },
    },
    editable: false,
  });
  useLayoutEffect(() => {
    if (!ws || !editor) return;
    ws.onmessage = (e) => {
      if (typeof e.data !== "string") return;
      const data = JSON.parse(e.data) as { event: string; data: any };
      switch (data.event) {
        case "permission":
          setHasPermission(data.data.hasPermission);
          setIsLocked(data.data.isLocked);

          editor?.setOptions({
            editable: data.data.hasPermission,
          });
          break;
        case "refresh":
          window.location.reload();
          break;
      }
    };
  }, [editor, ws, hasPermission]);

  useEffect(() => {
   
      editor
        ?.chain()
        .focus()
        .updateUser({
          name: "Anonymous",
          color: userColor(String(userId)),
        })
        .run();
  }, [status]);

  useLayoutEffect(() => {
    if (provider) {
      provider.on("synced", () => {
        const texts = editor?.getText() ?? "";
        if (texts == "") {
          editor
            ?.chain()
            .setContent(
              `<h1>Welcome to the note!</h1>
    This is a collaborative note. Share the URL with your friends to collaborate.
        `
            )
            .run();
        }
      });
    }
  }, [provider, editor]);

  const openLockModal = () => {
    setPasswordModal(true);
  };

  const [passwordModal, setPasswordModal] = useState(false);

  const lockAction = () => {
    if (!hasPermission && isLocked) {
      wsEvent("unlock", password);
    } else {
      wsEvent("lock", password);
    }
    setPasswordModal(false);
  };
  return {
    noteId,
    editor,
    users: editor?.storage?.collaborationCursor?.users,
    isLocked,
    hasPermission,
    openLockModal,
    passwordModal,
    closePasswordModal: () => setPasswordModal(false),
    setPassword,
    password,
    lockAction,
  };
};

export default useNote;
