import { useDeleteConversation } from "@/hooks/db/useDeleteConversation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useConversationStore from "@/state/useConversationStore";
import useDialogStore from "@/state/useDialogStore";

const ConversationsDialog = () => {
  const { isOpen, close, toggle } = useDialogStore();
  const { clickedDeleteButtonId } = useConversationStore();

  const { mutate: deleteConversation } = useDeleteConversation();

  const handleDeleteButtonClick = async (id: number) => {
    deleteConversation(id);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            This will delete Empty Message, User Inquiry.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={() => handleDeleteButtonClick(clickedDeleteButtonId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationsDialog;
