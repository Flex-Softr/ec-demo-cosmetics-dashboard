"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { TPermission } from "@/redux/features/permissions/permissionInterface";
import { useAddOrRemovePermissionFromUserMutation } from "@/redux/features/permissions/permissionsAPi";
import { TUser } from "@/redux/features/user/userInterface";
import { permission as permissionList } from "@/types/order/order.interface";
import { TSuccessResponse } from "@/types/response/response";
import { TGenericErrorResponse } from "@/utilities/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PermissionTable = ({
  permissionData,
  user,
}: {
  permissionData: TPermission[];
  user: TUser;
}) => {
  const [addRemovePermission] = useAddOrRemovePermissionFromUserMutation();
  const { toast } = useToast();
  const FormSchema = z.object({
    superAdmin: z.boolean().optional(),
    manageAdminOrStaff: z.boolean().optional(),
    manageShippingCharges: z.boolean().optional(),
    manageCoupon: z.boolean().optional(),
    managePermission: z.boolean().optional(),
    manageOrder: z.boolean().optional(),
    manageProcessing: z.boolean().optional(),
    manageCourier: z.boolean().optional(),
    manageWarrantyClaim: z.boolean().optional(),
    manageProduct: z.boolean().optional(),
    manageSms: z.boolean().optional(),
    manageCustomers: z.boolean().optional(),
  });

  const defaultValues = Object.keys(permissionList).reduce(
    (acc, key) => {
      const permissionKey = key as keyof typeof permissionList;
      acc[permissionKey] = (user?.permissions || []).includes(
        permissionList[permissionKey]
      );
      return acc;
    },
    {} as Record<keyof typeof permissionList, boolean>
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const formFieldData = [
    {
      ...permissionData.find((item) => item.name === "super admin"),
      description: "Can do anything. Do not give this to anyone.",
      fieldName: "superAdmin",
      warn: "Be careful",
    },
    {
      ...permissionData.find((item) => item.name === "manage admin or staff"),
      description: "Manage admin and staff",
      fieldName: "manageAdminOrStaff",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage shipping charges"),
      description: "Can manage shipping charges",
      fieldName: "manageShippingCharges",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage coupon"),
      description: "Can add or delete coupons",
      fieldName: "manageCoupon",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage permission"),
      description: "Can add new permission",
      fieldName: "managePermission",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage orders"),
      description: "Can manage orders",
      fieldName: "manageOrder",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage warehouse"),
      description: "Can manage processing orders and can add warranty codes",
      fieldName: "manageProcessing",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage courier"),
      description: "Can book courier",
      fieldName: "manageCourier",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage warranty claim"),
      description: "Can manage warranty claims",
      fieldName: "manageWarrantyClaim",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage product"),
      description: "Can manage products",
      fieldName: "manageProduct",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage sms"),
      description: "Can send sms",
      fieldName: "manageSms",
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === "manage customers"),
      description: "Can manage customers",
      fieldName: "manageCustomers",
      warn: undefined,
    },
  ];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const trueFields = Object.keys(data).filter(
      (field) =>
        (
          data as {
            [key: string]: boolean;
          }
        )[field]
    );
    const ids = formFieldData
      .filter(
        (item) => "fieldName" in item && trueFields.includes(item.fieldName)
      )
      .map((item) => item._id)
      .filter(Boolean);

    try {
      const res = (await addRemovePermission({
        useId: user._id,
        permissions: ids,
      }).unwrap()) as TSuccessResponse;
      toast({
        className: "toast-success",
        title: res.message,
      });
    } catch (err) {
      const error = err as { data: TGenericErrorResponse };
      toast({
        className: "toast-error",
        title: error.data.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 mt-10"
      >
        <div>
          <h3 className="mb-4 text-lg font-medium">Permissions</h3>
          <div className="space-y-4">
            {formFieldData.map((item) => (
              <FormField
                key={item.fieldName}
                control={form.control}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={item.fieldName as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base capitalize">
                        {item.name}{" "}
                        {item?.warn ? <Badge>{item?.warn}</Badge> : ""}
                      </FormLabel>
                      <FormDescription>{item.description}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <Button type="submit">Update permission</Button>
      </form>
    </Form>
  );
};

export default PermissionTable;
