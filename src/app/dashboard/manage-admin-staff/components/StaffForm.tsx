"use client";
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
import { PERMISSIONS } from "@/const/permissions";
import { ROLES } from "@/const/role";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { TPermission } from "@/redux/features/permissions/permissionInterface";
import { useGetAllPermissionsQuery } from "@/redux/features/permissions/permissionsAPi";
import {
  useCreateStaffOrAdminMutation,
  useUpdateStaffOrAdminMutation,
} from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/user/userInterface";
import { useAppSelector } from "@/redux/hooks";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import isPermitted from "@/utilities/isPermitted";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import PermissionTable from "./PermissionTable";

const passwordValidatorRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&*]).{8,}$/;

const schema = yup.object().shape({
  fullName: yup.string().when("$isUpdate", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Name is required"),
  }),
  phoneNumber: yup.string().when("$isUpdate", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Phone number is required"),
  }),
  email: yup
    .string()
    .email("Invalid email address")
    .when("$isUpdate", {
      is: true,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Email is required"),
    }),
  password: yup.string().when("$isUpdate", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) =>
      schema.required("Password is required").matches(passwordValidatorRegex, {
        message:
          "Password must be at least 8 characters long with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%&*).",
      }),
  }),
  fullAddress: yup.string().when("$isUpdate", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Address is required"),
  }),
  emergencyContact: yup.string().optional(),
  NIDNo: yup.string().optional(),
  birthCertificateNo: yup.string().optional(),
  role: yup.string().optional(),
  joiningDate: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  image: yup.string().optional(),
});

export type TFormInput = yup.InferType<typeof schema>;

const StaffForm = ({
  setModalOpen,
  user,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  user?: TUser;
}) => {
  const isUpdate = !!user;
  const targetUser = user!; // Safe because isUpdate is true only if user is defined

  const { data: permissionResponse, isLoading: permissionDataLoading } =
    useGetAllPermissionsQuery({});
  const permissionData =
    (permissionResponse as TSuccessResponse<TPermission>)?.data || [];
  const { user: loggedInUser } = useAppSelector(({ auth }) => auth);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (isUpdate && user?.permissions) {
      setSelectedPermissions(user.permissions.map((p) => p._id));
    }
  }, [isUpdate, user]);

  const [role, setRole] = useState<null | string>(user?.role || null);
  const [roleError, setRoleError] = useState<null | string>(null);
  const [status, setStatus] = useState(user?.status || "active");
  const [joiningDate, setJoiningDate] = useState<Date | undefined>(
    user?.joiningDate ? new Date(user.joiningDate) : undefined
  );
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined
  );
  const [open, setOpen] = useState(false);
  const [openBirthDate, setOpenBirthDate] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profilePicture || null
  );

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [selectedImage]);

  const { toast } = useToast();
  const [createUser, { isLoading: isCreating }] =
    useCreateStaffOrAdminMutation();
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateStaffOrAdminMutation();

  const isLoading = isCreating || isUpdating;

  const handleOpen = () => setOpen((prev) => !prev);
  const handleBirthDateOpen = () => setOpenBirthDate((prev) => !prev);

  const canMangePermission = isPermitted(
    loggedInUser?.permissions,
    PERMISSIONS.MANAGE_PERMISSION
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: yupResolver(schema),
    context: { isUpdate },
    defaultValues: isUpdate
      ? {
          fullName: user?.fullName,
          phoneNumber: user?.phoneNumber,
          email: user?.email,
          fullAddress: user?.address?.fullAddress,
          emergencyContact: user?.emergencyContact,
          NIDNo: user?.NIDNo,
          birthCertificateNo: user?.birthCertificateNo,
        }
      : {},
  });

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    setRoleError(null);
    if (!isUpdate && !role) {
      setRoleError("Role is required");
      return;
    }

    const formData = new FormData();

    if (isUpdate && targetUser) {
      if (data?.phoneNumber && targetUser.phoneNumber !== data?.phoneNumber)
        formData.append("phoneNumber", data.phoneNumber);
      if (data?.email && targetUser.email !== data?.email)
        formData.append("email", data.email);
      if (
        data?.fullAddress &&
        data?.fullAddress !== targetUser?.address?.fullAddress
      )
        formData.append("address[fullAddress]", data.fullAddress);
      if (data?.fullName && data?.fullName !== targetUser?.fullName)
        formData.append("personalInfo[fullName]", data.fullName);
      if (
        data?.emergencyContact &&
        data?.emergencyContact !== targetUser?.emergencyContact
      )
        formData.append(
          "personalInfo[emergencyContact]",
          data.emergencyContact
        );
      if (data?.NIDNo && data?.NIDNo !== targetUser?.NIDNo)
        formData.append("personalInfo[NIDNo]", data.NIDNo);
      if (
        data?.birthCertificateNo &&
        data?.birthCertificateNo !== targetUser?.birthCertificateNo
      )
        formData.append(
          "personalInfo[birthCertificateNo]",
          data.birthCertificateNo
        );

      const formattedJoiningDate = joiningDate
        ? formatDate(joiningDate)
        : undefined;
      if (
        formattedJoiningDate &&
        formattedJoiningDate !== targetUser.joiningDate
      )
        formData.append("personalInfo[joiningDate]", formattedJoiningDate);

      const formattedBirthDate = dateOfBirth
        ? formatDate(dateOfBirth)
        : undefined;
      if (formattedBirthDate && formattedBirthDate !== targetUser.dateOfBirth)
        formData.append("personalInfo[dateOfBirth]", formattedBirthDate);

      if (selectedImage?.length) formData.append("image", selectedImage[0]);
      if (status && status !== targetUser.status)
        formData.append("status", status);
    } else {
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("email", data.email || "");
      formData.append("password", data.password || "");
      formData.append("role", role || "");
      formData.append("address[fullAddress]", data.fullAddress || "");
      formData.append("personalInfo[fullName]", data.fullName || "");
      if (data?.emergencyContact)
        formData.append(
          "personalInfo[emergencyContact]",
          data.emergencyContact
        );
      if (data?.NIDNo) formData.append("personalInfo[NIDNo]", data?.NIDNo);
      if (data?.birthCertificateNo)
        formData.append(
          "personalInfo[birthCertificateNo]",
          data.birthCertificateNo
        );
      if (joiningDate) {
        const formatted = formatDate(joiningDate);
        if (formatted) formData.append("personalInfo[joiningDate]", formatted);
      }
      if (dateOfBirth) {
        const formatted = formatDate(dateOfBirth);
        if (formatted) formData.append("personalInfo[dateOfBirth]", formatted);
      }
      if (selectedImage) formData.append("image", selectedImage[0]);

      // Add permissions to creation payload
      selectedPermissions.forEach((id) => {
        formData.append("permissions", id);
      });
    }

    try {
      let result: TSuccessResponse;
      if (isUpdate && targetUser) {
        // Add permissions to update payload
        selectedPermissions.forEach((id) => {
          formData.append("permissions", id);
        });

        if (role && role !== targetUser.role) {
          formData.append("role", role);
        }

        result = (await updateUser({
          body: formData,
          id: targetUser._id,
        }).unwrap()) as TSuccessResponse;
      } else {
        result = (await createUser(formData).unwrap()) as TSuccessResponse;
      }

      toast({
        className: "toast-success",
        title: result.message,
      });
      if (!isUpdate) reset();
      setModalOpen(false);
    } catch (err) {
      const error = err as { data: TErrorResponse };
      toast({
        className: "toast-error",
        title: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div>
      <form
        id="staff-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">
              Enter Name {!isUpdate && <span className="text-red-600">*</span>}
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
              Enter phone number{" "}
              {!isUpdate && <span className="text-red-600">*</span>}
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
              Enter email {!isUpdate && <span className="text-red-600">*</span>}
            </Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                {...register("email")}
                id="email"
                placeholder="Enter email"
                className="w-full"
              />
              {errors.email?.message && (
                <p className="text-red-600 font-bold text-sm">
                  {errors.email?.message}
                </p>
              )}
            </div>
          </div>
          {!isUpdate && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">
                Enter password <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  {...register("password")}
                  id="password"
                  placeholder="Enter password"
                  className="w-full"
                />
                {errors.password?.message && (
                  <p className="text-red-600 font-bold text-sm">
                    {errors.password?.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullAddress">
              Enter address{" "}
              {!isUpdate && <span className="text-red-600">*</span>}
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
            <Label htmlFor="role">
              {isUpdate ? "Role" : "Select role"}{" "}
              {!isUpdate && <span className="text-red-600">*</span>}
            </Label>
            <div className="space-y-2 w-full">
              <Select
                onValueChange={(changedValue) => {
                  setRole(changedValue);
                  setRoleError(null);
                }}
                defaultValue={role || undefined}
              >
                <SelectTrigger className="w-full border-primary border-[1px]">
                  <SelectValue placeholder="Role" className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value={ROLES.ADMIN} className="capitalize">
                      Admin
                    </SelectItem>
                    <SelectItem value={ROLES.STAFF} className="capitalize">
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
            <Label htmlFor="emergencyContact">Enter emergency contact no</Label>
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
                placeholder="Enter NID number"
                className="w-full"
              />
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
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="joiningDate">Select joining date</Label>
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
            <Label htmlFor="dateOfBirth">Add birth date</Label>
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
          {isUpdate && canMangePermission && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">
                Change status <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <Select
                  onValueChange={(changedValue) => setStatus(changedValue)}
                  defaultValue={status}
                >
                  <SelectTrigger className="w-full border-primary border-[1px]">
                    <SelectValue placeholder="Status" className="capitalize" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="active" className="capitalize">
                        Active
                      </SelectItem>
                      <SelectItem value="banned" className="capitalize">
                        Banned
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Profile picture</Label>
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 rounded-full border-2 border-dashed border-primary flex items-center justify-center overflow-hidden bg-muted flex-shrink-0">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(user?.profilePicture || null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors z-50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files)}
                  id="image"
                  className="cursor-pointer h-10"
                />
                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                  JPG, PNG or GIF. Max size of 2MB.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {permissionDataLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground italic">
          Loading permissions...
        </div>
      ) : (
        <PermissionTable
          permissionData={permissionData as TPermission[]}
          onPermissionChange={(ids) => setSelectedPermissions(ids)}
          selectedPermissions={selectedPermissions}
          user={isUpdate ? targetUser : undefined}
        />
      )}

      <div className="flex justify-end gap-3 mb-6 mt-6">
        <EcButton
          form="staff-form"
          disabled={isLoading}
          loading={isLoading}
          type="submit"
        >
          {isUpdate ? "Update user" : "Create user"}
        </EcButton>
      </div>
    </div>
  );
};

export default StaffForm;
