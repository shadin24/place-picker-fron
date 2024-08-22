import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();

  
  useImperativeHandle(ref, () => ({
    open() {
      if (dialogRef.current) {
        dialogRef.current.showModal(); 
      }
    },
    close() {
      if (dialogRef.current) {
        dialogRef.current.close(); 
      }
    }
  }));

  return createPortal(
    <dialog className="modal" ref={dialogRef}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
