import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TCommonAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
};

const CommonAlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: TCommonAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-4">
          <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors px-6">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="px-6 shadow-sm"
          >
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommonAlertDialog;
