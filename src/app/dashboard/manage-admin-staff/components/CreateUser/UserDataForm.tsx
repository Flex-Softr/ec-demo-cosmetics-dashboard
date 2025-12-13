import EcButton from "@/components/EcButton/EcButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { useCreateStaffOrAdminMutation } from "@/redux/features/user/userApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
const passwordValidatorRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&*]).{8,}$/;
const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .matches(passwordValidatorRegex, {
      message:
        "Invalid password. It must be 8 characters long with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%&*).",
    }),
  fullAddress: yup.string().required("Address is required"),
  emergencyContact: yup.string().required("Emergency contact no is required"),
  NIDNo: yup.string().optional(),
  birthCertificateNo: yup.string().optional(),
  role: yup.string().optional(),
  joiningDate: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  image: yup.string().optional(),
});

export type TFormInput = yup.InferType<typeof schema>;

const UserDataForm = ({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [role, setRole] = useState<null | string>(null);
  const [roleError, setRoleError] = useState<null | string>(null);
  const [joiningDate, setJoiningDate] = useState<Date | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [openBirthDate, setOpenBirthDate] = useState(false);
  const { toast } = useToast();
  const [createUser, { isLoading }] = useCreateStaffOrAdminMutation();
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleBirthDateOpen = () => {
    setOpenBirthDate((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: yupResolver(schema),
  });

  const restFormData = () => {
    reset();
    setJoiningDate(undefined);
    setDateOfBirth(undefined);
  };

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    setRoleError(null);
    if (!role) {
      setRoleError("Role is required");
      return;
    }
    data.role = role;
    if (joiningDate) {
      data.joiningDate = formatDate(joiningDate);
    }
    if (dateOfBirth) {
      data.dateOfBirth = formatDate(dateOfBirth);
    }
    // Create form data

    const formData = new FormData();
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    formData.append("address[fullAddress]", data.fullAddress);
    formData.append("personalInfo[fullName]", data.fullName);
    if (data?.emergencyContact)
      formData.append("personalInfo[emergencyContact]", data.emergencyContact);
    if (data?.NIDNo) formData.append("personalInfo[NIDNo]", data?.NIDNo);
    if (data?.birthCertificateNo)
      formData.append(
        "personalInfo[birthCertificateNo]",
        data?.birthCertificateNo
      );
    if (data?.joiningDate)
      formData.append("personalInfo[joiningDate]", data?.joiningDate);
    if (data?.dateOfBirth)
      formData.append("personalInfo[dateOfBirth]", data?.dateOfBirth);
    if (selectedImage) formData.append("image", selectedImage[0]);
    try {
      const result = (await createUser(formData).unwrap()) as TSuccessResponse;
      toast({
        className: "toast-success",
        title: result.message,
      });
      restFormData();
      setModalOpen(false);
    } catch (err) {
      const error = err as { data: TErrorResponse };
      toast({
        className: "toast-error",
        title: error?.data?.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">
              Enter Name <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("fullName")}
                id="fullName"
                placeholder="Enter Name"
                className="w-full"
              />
              {errors.fullName?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.fullName?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">
              Enter phone number <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("phoneNumber")}
                id="phoneNumber"
                placeholder="Enter phone number"
                className="w-full"
              />
              {errors.phoneNumber?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.phoneNumber?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              Enter email <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("email")}
                id="email"
                placeholder="Enter phone number"
                className="w-full"
              />
              {errors.email?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.email?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">
              Enter password <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("password")}
                id="password"
                placeholder="Enter phone number"
                className="w-full"
              />
              {errors.password?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.password?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullAddress">
              Enter address <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("fullAddress")}
                id="fullAddress"
                placeholder="Enter full address"
                className="w-full"
              />
              {errors.fullAddress?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.fullAddress?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullAddress">
              Select role <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Select onValueChange={(changedValue) => setRole(changedValue)}>
                <SelectTrigger className="w-full border-primary border-[1px]">
                  <SelectValue placeholder="Role" className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="admin" className="capitalize">
                      Admin
                    </SelectItem>
                    <SelectItem value="staff" className="capitalize">
                      Staff
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {roleError && (
                <p className="text-red-600 font-bold text-sm">{roleError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="emergencyContact">
              Enter emergency contact no <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("emergencyContact")}
                id="emergencyContact"
                placeholder="Enter emergency contact"
                className="w-full"
              />
              {errors.emergencyContact?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.emergencyContact?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="NIDNo">Enter NID number</Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("NIDNo")}
                id="NIDNo"
                placeholder="Enter emergency contact"
                className="w-full"
              />
              {errors.NIDNo?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.NIDNo?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="birthCertificateNo">
              Enter birth certificate number
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("birthCertificateNo")}
                id="birthCertificateNo"
                placeholder="Enter birth certificate"
                className="w-full"
              />
              {errors.birthCertificateNo?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.birthCertificateNo?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="NIDNo">Select joining date</Label>
            <Popover onOpenChange={handleOpen} open={open}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-[1px] border-primary",
                    !joiningDate && "text-muted-foreground"
                  )}
                >
                  {joiningDate ? (
                    formatDate(joiningDate)
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Select Joining date</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="space-y-2 w-full">
                  <Calendar
                    mode="single"
                    selected={joiningDate}
                    onSelect={(selectedDate) => {
                      setJoiningDate(selectedDate);
                      setOpen(false);
                    }}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="NIDNo">Add birth date</Label>
            <Popover onOpenChange={handleBirthDateOpen} open={openBirthDate}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-[1px] border-primary",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  {dateOfBirth ? (
                    formatDate(dateOfBirth)
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Select birth date</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="space-y-2 w-full">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={(selectedDate) => {
                      setDateOfBirth(selectedDate);
                      setOpenBirthDate(false);
                    }}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Select profile picture</Label>
            <div className="space-y-2 w-full">
              <Input
                type="file"
                onChange={(e) => setSelectedImage(e.target.files)}
                id="image"
                placeholder="Enter emergency contact"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <EcButton disabled={isLoading} loading={isLoading} type="submit">
          Create
        </EcButton>
      </form>
    </div>
  );
};

export default UserDataForm;
