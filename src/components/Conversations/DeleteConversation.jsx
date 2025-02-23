import React, { useState  } from 'react';
import store from '~/store';
import { Dialog } from '../ui/Dialog.tsx';
import DialogTemplate from '../ui/DialogTemplate';

const DeleteConversation = ({ onSave,open, onOpenChange }) => {
  const { refreshConversations } = store.useConversations();

  const clickHandler = (event) => {
  
    event.stopPropagation();
    onSave();
    refreshConversations();
  };

  return (
   <Dialog
    open={open}
    onOpenChange={onOpenChange}
      >
      <DialogTemplate
        title="Delete conversation"
        description="Are you sure you want to delete this conversation? This is irreversible."
        selection={{
          selectHandler: clickHandler,
          selectClasses: 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white',
          selectText: 'Delete'
        }}
      />
    </Dialog>
  );
};

export default DeleteConversation;
