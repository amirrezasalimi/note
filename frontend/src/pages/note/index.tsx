import { EditorContent } from "@tiptap/react";
import useNote from "./hooks/note";
import "./style.scss";
import { LockIcon, UnlockIcon } from "../../shared/components/icons";
import clsx from "clsx";
import Modal from "../../shared/components/modal";

const Note = () => {
  const note = useNote();

  return (
    <>
      <Modal
        isOpen={note.passwordModal}
        onClose={note.closePasswordModal}
        className="max-w-sm"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold">
            {
              // update password or lock | unlock
              note.isLocked
                ? note.hasPermission
                  ? "Update note password"
                  : "Unlock"
                : "Lock note"
            }
          </h1>
          <input
            value={note.password ?? ""}
            onChange={(e) => note.setPassword(e.target.value)}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {note.isLocked && note.hasPermission && (
            <span className="text-sm text-gray-500">
              remove the password by leaving the field empty
            </span>
          )}
          <button
            onClick={note.lockAction}
            className="w-full mt-2 bg-blue-500 text-white rounded-md px-4 py-2"
          >
            {/* update password or lock | unlock */}
            {note.isLocked
              ? note.hasPermission
                ? "Update password"
                : "Unlock"
              : "Lock"}
          </button>
        </div>
      </Modal>
      <div className="w-full h-screen flex flex-col">
        <div className="w-full flex items-center justify-end px-8 gap-4 py-4">
          <span className="flex gap-1 justify-center items-center text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{note.users?.length ?? 1}</span>
            <span>user online</span>
          </span>
          <div>
            <button
              className={clsx(
                "flex font-[Charter] gap-2 items-center text-sm bg-gray-200 px-3 py-1 rounded-md transition-colors",
                "hover:bg-gray-300 cursor-pointer"
              )}
              onClick={note.openLockModal}
            >
              {!note.hasPermission ? <UnlockIcon /> : <LockIcon />}
              <span>{!note.hasPermission ? "Unlock" : "Lock"}</span>
            </button>
          </div>
        </div>
        <div className="container mx-auto max-w-2xl h-full">
          <div className="w-full h-full">
            <EditorContent editor={note.editor} className="w-full h-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
