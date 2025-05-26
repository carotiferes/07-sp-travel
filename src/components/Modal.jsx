import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children }) {
  const dialog = useRef();

  // to sync value to dom
  useEffect(() => {
    if(open) dialog.current.showModal();
    else dialog.current.close();
  }, [open]) // it runs when the component re-execs ONLY when the dependencies change ([] is only once)
  // it will run every time "open" changes

  return createPortal(
		<dialog className="modal" ref={dialog} onClose={onClose}>
			{open ? children : null}
		</dialog>,
		document.getElementById("modal")
	);
};

export default Modal;
