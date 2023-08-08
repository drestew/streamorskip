import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import { space } from '@styles/theme';
import { SignupForm } from '@features/auth';
import React from 'react';

const overlayShow = keyframes`
  0% {opacity: 0}
  100% {opacity: 1}
`;

const contentShow = keyframes`
  0% {opacity: 0; transform: translate(-50%, -48%) scale(.96)}
  100% {opacity: 1; transform: translate(-50%, -50%) scale(1)}
`;

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Content = styled(Dialog.DialogContent)`
  width: 90%;
  max-width: 400px;
  max-height: 85vh;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  padding: ${space(4)};
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;
export function Modal({ modalOpen }: { modalOpen: boolean }) {
  const [open, setOpen] = React.useState(modalOpen);

  function openChange() {
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={openChange}>
      <Dialog.Portal>
        <DialogOverlay />
        <Content>
          <SignupForm />
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
