'use client'
import React from "react";
import { useAppContext } from "./AppContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

const InfoModal = () => {
  const { isModalOpen, setIsModalOpen } = useAppContext();

  if (!isModalOpen) return null;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsModalOpen(false);
    }
  }

  return (
    <Modal isOpen={isModalOpen} onOpenChange={onOpenChange} size="sm" placement="top" backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-white",
          closeButton: "text-lg hover:bg-white/5 active:bg-white/10",
        }}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Info</ModalHeader>
          <ModalBody>
            <div className="flex flex-col">
              <p className="text-md">Contact</p>
              <p className="text-small text-default-500">Andrew Rudy - ucrudy@gmail.com</p>
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-md">Tech</p>
              <p className="text-small text-default-500">TypeScript - React - Canvas + D3 - Next.js - Foursquare API</p>
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-md">Features</p>
              <p className="text-small text-default-500">Geolocation</p>
              <p className="text-small text-default-500">Custom UI with Canvas + D3, React, HeroUI, Tailwind</p>
              <p className="text-small text-default-500">Filters connected with state management</p>
              <p className="text-small text-default-500">External API data retrieval and backend caching</p>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
  );
};

export default InfoModal;