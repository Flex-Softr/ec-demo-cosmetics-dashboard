import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TProps = {
  children: React.ReactNode;
  open: boolean;
  handleOpen: (open: boolean) => void;
  modalTitle?: string;
  className?: string;
};
const CommonModal = ({
  children,
  open,
  handleOpen,
  modalTitle,
  className,
}: TProps) => {
  return (
    <div>
      <Dialog onOpenChange={handleOpen} open={open}>
        <DialogContent className={`${className}`}>
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              {modalTitle}
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommonModal;
