import { EditorContent } from "@tiptap/react";
import useNote from "./hooks/note";
import "./style.scss";
import {
  GithubIcon,
  LockIcon,
  UnlockIcon,
} from "../../shared/components/icons";
import clsx from "clsx";
import Modal from "../../shared/components/modal";
import DarkModeToggle from "./components/dark-mode-toggle";

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
          <h3 className="text-lg font-bold">
            {
              // update password or lock | unlock
              note.isLocked
                ? note.hasPermission
                  ? "Update note password"
                  : "Unlock"
                : "Lock note"
            }
          </h3>
          <input
            value={note.password ?? ""}
            onChange={(e) => note.setPassword(e.target.value)}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 bg-light-background dark:bg-dark-background dark:border-gray-500 rounded-md"
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
      <div className="w-full h-screen flex flex-col mb-10">
        <div className="w-full flex items-center justify-between px-4 lg:px-8 gap-4 py-4 fixed backdrop-blur-lg !bg-opacity-80 dark:bg-dark-background bg-light-background z-10">
          <div className="flex items-center lg:space-x-8 space-x-4">
            <a href="https://github.com/amirrezasalimi/note" target="_blank">
              <GithubIcon />
            </a>
            <DarkModeToggle />
          </div>
          <div className="flex gap-4">
            <span className="flex gap-1 justify-center items-center text-sm text-light-text dark:text-dark-text">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{note.users?.length ?? 1}</span>
              <span>user online</span>
            </span>
            <button
              className={clsx(
                "hidden lg:flex font-[Charter] gap-2 bg-light-button dark:hover:bg-slate-700 dark:bg-dark-button dark:text-dark-text text-light-text items-center text-sm px-3 py-1 rounded-md transition-colors",
                "hover:bg-gray-300 cursor-pointer"
              )}
              onClick={note.fullWidth}
            >
              {
                note.isFullWidth ? "Normal" : "Wide"
              }{" "}
              Container
            </button>
            <button
              onClick={note.bionicToggle}
              className={clsx(
                "flex gap-2 items-center text-sm bg-light-button dark:bg-dark-button dark:text-dark-text text-light-text px-3 py-1 rounded-md transition-colors dark:hover:bg-slate-700 hover:bg-gray-300 cursor-pointer",
                note.isBionic && "!bg-black text-white"
              )}
            >
              <div className="font-light">
                <span className="font-bold">Bio</span>nic
              </div>
            </button>
            <button
              className={clsx(
                "flex font-[Charter] gap-2 bg-light-button dark:hover:bg-slate-700 dark:bg-dark-button dark:text-dark-text text-light-text items-center text-sm px-3 py-1 rounded-md transition-colors",
                "hover:bg-gray-300 cursor-pointer"
              )}
              onClick={note.openLockModal}
            >
              {!note.hasPermission ? <UnlockIcon /> : <LockIcon />}
              <span>{!note.hasPermission ? "Unlock" : "Lock"}</span>
            </button>
          </div>
        </div>
        <div
          className={`container mx-auto text-light-text h-full pt-24 ${
            note.isFullWidth ? "lg:max-w-5xl max-w-2xl" : "max-w-2xl"
          }`}
        >
          <div className="w-full h-full">
            <EditorContent
              editor={note.editor}
              className={`w-full h-full editor-Content ${
                note.isFullWidth ? "active" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
