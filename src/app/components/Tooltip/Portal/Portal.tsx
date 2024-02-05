import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PropTypes {
  children: ReactNode;
}

export default function InPortal({ children }: PropTypes) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return createPortal(children, document.body);
}
