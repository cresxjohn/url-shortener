'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 mx-4 w-full max-w-lg">{children}</div>
    </div>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-0 bg-white shadow-2xl ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className = '',
}) => {
  return <div className={`border-b px-6 py-4 ${className}`}>{children}</div>;
};

const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`mt-1 text-sm text-gray-600 ${className}`}>{children}</p>
  );
};

const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`border-t bg-gray-50 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

// Close button component for dialog headers
interface DialogCloseProps {
  onClick: () => void;
  className?: string;
}

const DialogClose: React.FC<DialogCloseProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`hover:bg-white/20 ${className}`}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
