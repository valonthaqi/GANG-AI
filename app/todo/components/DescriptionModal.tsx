"use client";

import {
  Dialog,
  Transition,
  Description,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
};

export default function DescriptionModal({
  open,
  onClose,
  title,
  description,
}: Props) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Overlay with fade */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg transition-all">
              <h2 className="text-lg font-bold mb-2">{title}</h2>
              <Description className="text-sm text-gray-700 whitespace-pre-wrap">
                {description}
              </Description>

              <button
                onClick={onClose}
                className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 text-sm rounded"
              >
                Close
              </button>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
