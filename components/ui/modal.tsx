"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";

interface ModalProps extends React.ComponentProps<typeof Dialog> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({
  title,
  description,
  footer,
  children,
  showCloseButton = true,
  ...props
}: ModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent showCloseButton={showCloseButton}>
        {(title || description) && (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};

export { Modal, DialogTrigger as ModalTrigger, DialogClose as ModalClose };
