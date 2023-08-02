import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import { space } from '@styles/theme';

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
  width: 90vw;
  max-width: 400px;
  max-height: 85vh;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  padding: ${space(4)};
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;
export function Modal() {
  return (
    <Dialog.Root open>
      <Dialog.Trigger asChild>
        <button>Sign up</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <Content>
          <Dialog.DialogTitle>Sign up</Dialog.DialogTitle>
          <Dialog.DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </Dialog.DialogDescription>
          <fieldset>
            <label htmlFor="name">Name</label>
            <input id="name" defaultValue="Pedro Duarte" />
          </fieldset>
          <fieldset>
            <label htmlFor="username">Username</label>
            <input id="username" defaultValue="@peduarte" />
          </fieldset>
          <Dialog.Close asChild>
            <button>Save changes</button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <i aria-label="Close">
              <button>Close</button>
            </i>
          </Dialog.Close>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
