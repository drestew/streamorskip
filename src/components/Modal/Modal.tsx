import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import React from 'react';

const contentShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Content = styled(Dialog.DialogContent)`
  max-width: 360px;
  position: relative;
  top: 25%;
  margin: auto;
  border-radius: 5px;
  animation: ${contentShow} 0.3s ease-in-out;
`;
export function Modal({
  modalOpen,
  children,
  openChange,
}: {
  modalOpen: boolean;
  children: React.ReactElement;
  openChange: () => void;
}) {
  return (
    <Dialog.Root open={modalOpen} onOpenChange={openChange}>
      <Dialog.Portal>
        <DialogOverlay>
          <Content>{children}</Content>
        </DialogOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
