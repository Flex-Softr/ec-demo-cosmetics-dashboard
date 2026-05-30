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
import { PERMISSIONS } from "@/const/permissions";
import { TPermission } from "@/redux/features/permissions/permissionInterface";
import { useAddOrRemovePermissionFromUserMutation } from "@/redux/features/permissions/permissionsAPi";
import { TUser } from "@/redux/features/user/userInterface";
import { TSuccessResponse } from "@/types/response";
import { TGenericErrorResponse } from "@/utilities/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PermissionTable = ({
  permissionData,
  user,
  isCreate = false,
  onPermissionChange,
  selectedPermissions: externalSelectedPermissions,
}: {
  permissionData: TPermission[];
  user?: TUser;
  isCreate?: boolean;
  onPermissionChange?: (permissionIds: string[]) => void;
  selectedPermissions?: string[];
}) => {
  const [addRemovePermission] = useAddOrRemovePermissionFromUserMutation();
  const { toast } = useToast();
  const FormSchema = z.object({
    [PERMISSIONS.SUPER_ADMIN]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_ADMIN_OR_STAFF]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_SHIPPING_CHARGE]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_COUPON]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_PERMISSION]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_ORDER]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_PROCESSING_ORDER]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_SHIPMENT_ORDER]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_WARRANTY_CLAIM]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_PRODUCT]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_BLOG]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_SMS]: z.boolean().optional(),
    [PERMISSIONS.MANAGE_CUSTOMER]: z.boolean().optional(),
  });

  const defaultValues = Object.values(PERMISSIONS).reduce(
    (acc, permissionValue) => {
      if (externalSelectedPermissions) {
        // If external state is provided, check against it
        const permissionId = permissionData.find(
          (p) => p.name === permissionValue
        )?._id;
        acc[permissionValue as keyof typeof FormSchema.shape] =
          !!permissionId && externalSelectedPermissions.includes(permissionId);
      } else {
        // Otherwise fallback to user permissions
        acc[permissionValue as keyof typeof FormSchema.shape] = (
          user?.permissions || []
        ).some((p) => p.name === permissionValue);
      }
      return acc;
    },
    {} as Record<string, boolean>
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const formFieldData = [
    {
      ...permissionData.find((item) => item.name === PERMISSIONS.SUPER_ADMIN),
      description: "Can do anything. Do not give this to anyone.",
      fieldName: PERMISSIONS.SUPER_ADMIN,
      warn: "Be careful",
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_ADMIN_OR_STAFF
      ),
      description: "Manage admin and staff",
      fieldName: PERMISSIONS.MANAGE_ADMIN_OR_STAFF,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_SHIPPING_CHARGE
      ),
      description: "Can manage shipping charges",
      fieldName: PERMISSIONS.MANAGE_SHIPPING_CHARGE,
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === PERMISSIONS.MANAGE_COUPON),
      description: "Can add or delete coupons",
      fieldName: PERMISSIONS.MANAGE_COUPON,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_PERMISSION
      ),
      description: "Can add new permission",
      fieldName: PERMISSIONS.MANAGE_PERMISSION,
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === PERMISSIONS.MANAGE_ORDER),
      description: "Can manage orders",
      fieldName: PERMISSIONS.MANAGE_ORDER,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_PROCESSING_ORDER
      ),
      description: "Can manage processing orders and can add warranty codes",
      fieldName: PERMISSIONS.MANAGE_PROCESSING_ORDER,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_SHIPMENT_ORDER
      ),
      description: "Can book courier",
      fieldName: PERMISSIONS.MANAGE_SHIPMENT_ORDER,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_WARRANTY_CLAIM
      ),
      description: "Can manage warranty claims",
      fieldName: PERMISSIONS.MANAGE_WARRANTY_CLAIM,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_PRODUCT
      ),
      description: "Can manage products",
      fieldName: PERMISSIONS.MANAGE_PRODUCT,
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === PERMISSIONS.MANAGE_BLOG),
      description: "Can manage blog posts, QnA, categories and tags",
      fieldName: PERMISSIONS.MANAGE_BLOG,
      warn: undefined,
    },
    {
      ...permissionData.find((item) => item.name === PERMISSIONS.MANAGE_SMS),
      description: "Can send sms",
      fieldName: PERMISSIONS.MANAGE_SMS,
      warn: undefined,
    },
    {
      ...permissionData.find(
        (item) => item.name === PERMISSIONS.MANAGE_CUSTOMER
      ),
      description: "Can manage customers",
      fieldName: PERMISSIONS.MANAGE_CUSTOMER,
      warn: undefined,
    },
  ];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (onPermissionChange || isCreate) return; // Parent handles submission if callback provided

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
        useId: user?._id as string,
        permissions: ids as string[],
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

  // Handle changes for create mode
  const handleSwitchChange = (fieldName: string, checked: boolean) => {
    if (!onPermissionChange) return;

    const currentValues = form.getValues();
    const newValues = { ...currentValues, [fieldName]: checked };

    const trueFields = Object.keys(newValues).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (field) => (newValues as any)[field]
    );
    const ids = formFieldData
      .filter(
        (item) => "fieldName" in item && trueFields.includes(item.fieldName)
      )
      .map((item) => item._id)
      .filter(Boolean);

    onPermissionChange(ids as string[]);
  };

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
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleSwitchChange(item.fieldName!, checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        {!isCreate && !onPermissionChange && (
          <div className="flex justify-end mb-6">
            <Button type="submit">Update permission</Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default PermissionTable;
