'use client'
import React from "react";
import { useAppContext } from "../AppContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

const LunchModal = () => {
  const { isModalOpen, setIsModalOpen } = useAppContext();

  if (!isModalOpen) return null;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsModalOpen(false);
    }
  }

  return (
    <Modal isOpen={isModalOpen} onOpenChange={onOpenChange} size="4xl" placement="top" backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          closeButton: "text-white text-6xl hover:bg-white/5 active:bg-white/10",
        }}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Menu</ModalHeader>
          <ModalBody>
            lunch here
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
  );
};

export default LunchModal;