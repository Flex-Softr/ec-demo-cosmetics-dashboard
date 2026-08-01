/* eslint-disable @next/next/no-img-element */
"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/formatDate";
import { useLazyGetFraudCheckQuery } from "@/redux/features/fraudCheck/fraudCheckApi";
import { AlertTriangle, Search, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

type Report = {
  reportFrom: string;
  comment: string;
  date: string;
};

type Errors = {
  errorFrom?: string;
  message: string;
};

type Courier = {
  name: string;
  logo: string;
  orders: number;
  deliveries: number;
  cancellations: number;
  deliveryRate: number;
};

type Data = {
  phoneNumber: string;
  totalOrders: number;
  totalDeliveries: number;
  totalCancellations: number;
  successRatio: number;
  message: string;
  couriers: Courier[];
  reports: Report[];
  errors: Errors[];
};

function ratioTone(ratio: number) {
  if (ratio >= 60) return "text-emerald-600";
  if (ratio >= 40) return "text-amber-600";
  return "text-destructive";
}

function ratioRingColor(ratio: number) {
  if (ratio >= 60) return "#10b981";
  if (ratio >= 40) return "#d97706";
  return "#ef4444";
}

const FraudCheckSkeleton = () => (
  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
    <div className="flex w-full flex-col items-center gap-3 lg:w-1/3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-36 w-36 rounded-full" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="w-full space-y-4 lg:w-2/3">
      <Skeleton className="mx-auto h-6 w-32" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  </div>
);

const FraudCheck = ({ phoneNumber }: { phoneNumber?: string }) => {
  const { toast } = useToast();
  const [data, setData] = useState<Data | null>(null);
  const [mobile, setMobile] = useState("");
  const [triggerFraudCheck, { isFetching: loading }] =
    useLazyGetFraudCheckQuery();
  const [open, setOpen] = useState(false);
  const isEmbedded = Boolean(phoneNumber);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSearch = async () => {
    const phone = (phoneNumber || mobile).trim();
    const regex = /^01\d{9}$/;

    if (!regex.test(phone)) {
      toast({
        variant: "destructive",
        title: "Please enter an 11 digit valid mobile number.",
      });
      return;
    }

    try {
      const response = await triggerFraudCheck(phone).unwrap();
      setData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title:
          error.data?.message ||
          error.message ||
          `Failed to fetch the customer fraud check data`,
      });
    }
  };

  const handleKeyPress = (e: { key: string; repeat: unknown }) => {
    if (e.key === "Enter" && !e.repeat) {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setMobile("");
    setData(null);
  };

  useEffect(() => {
    if (phoneNumber) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  return (
    <>
      <div className={cn("w-full", isEmbedded && "space-y-3")}>
        {isEmbedded ? (
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Fraud Check
            </h2>
          </div>
        ) : (
          <div className="mx-auto mb-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter mobile number (01XXXXXXXXX)"
                className="h-10 rounded-lg border-border bg-card pl-8 pr-10 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {mobile ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              size="sm"
              className="h-10 shrink-0 rounded-lg px-5"
            >
              {loading ? "Checking…" : "Check"}
            </Button>
          </div>
        )}

        {loading ? (
          <FraudCheckSkeleton />
        ) : data ? (
          <div className="flex w-full flex-col-reverse items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Delivery Success Ratio */}
            <div className="w-full shrink-0 text-center lg:w-1/3">
              <h3 className="text-sm font-semibold text-foreground">
                Delivery Success Ratio
              </h3>
              <div className="relative mx-auto mt-4 h-36 w-36">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      ${ratioRingColor(data.successRatio)} ${data.successRatio * 3.6}deg,
                      hsl(var(--muted)) ${data.successRatio * 3.6}deg
                    )`,
                  }}
                />
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card border border-border">
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      ratioTone(data.successRatio)
                    )}
                  >
                    {data.successRatio}%
                  </span>
                </div>
              </div>
              <p
                className={cn(
                  "mt-3 text-sm font-medium",
                  ratioTone(data.successRatio)
                )}
              >
                {data.message}
              </p>
            </div>

            <div className="w-full space-y-4 overflow-hidden lg:w-2/3">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-muted-foreground">Mobile Number</p>
                  <h3 className="text-lg font-semibold text-primary">
                    {data.phoneNumber}
                  </h3>
                </div>
                {data?.reports && data.reports.length > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpen}
                    className="h-8 gap-1.5 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    View reports ({data.reports.length})
                  </Button>
                ) : null}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-border bg-muted/40 px-3 py-3 text-center">
                  <h4 className="text-xl font-bold text-foreground">
                    {data.totalOrders}
                  </h4>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    মোট অর্ডার
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-emerald-50/80 px-3 py-3 text-center">
                  <h4 className="text-xl font-bold text-emerald-600">
                    {data.totalDeliveries}
                  </h4>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    মোট ডেলিভারি
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-red-50/80 px-3 py-3 text-center">
                  <h4 className="text-xl font-bold text-destructive">
                    {data.totalCancellations}
                  </h4>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    মোট বাতিল
                  </p>
                </div>
              </div>

              {/* Courier Stats Table */}
              <div className="overflow-x-auto overflow-hidden rounded-xl border border-border">
                <table className="w-full min-w-[500px] text-center text-sm whitespace-nowrap">
                  <thead className="bg-muted">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        কুরিয়ার
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        অর্ডার
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        ডেলিভারি
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        বাতিল
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        ডেলিভারি হার
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.couriers?.map((courier, index) => (
                      <tr
                        key={index}
                        className="border-b border-border last:border-0 hover:bg-muted/60"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={courier.logo}
                              alt={courier.name}
                              className="h-5"
                            />
                            <span className="sr-only">{courier.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {courier.orders}
                        </td>
                        <td className="px-4 py-3 text-emerald-600">
                          {courier.deliveries}
                        </td>
                        <td className="px-4 py-3 text-destructive">
                          {courier.cancellations}
                        </td>
                        <td className="min-w-[150px] px-4 py-3 font-semibold text-foreground">
                          {courier.deliveryRate}%
                          <div className="mt-1 h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${courier.deliveryRate}%` }}
                              title={`Delivery success rate ${courier.deliveryRate}%`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          !isEmbedded && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a mobile number and click &quot;Check&quot; to view
                customer fraud risk.
              </p>
            </div>
          )
        )}
      </div>

      {data?.errors?.map((error, index) => (
        <div
          key={index}
          className="mt-4 space-y-1 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <p>
            {error.errorFrom ? `${error.errorFrom} error: ` : null}
            {error.message}
          </p>
        </div>
      ))}

      {data?.reports?.length ? (
        <CommonModal
          open={open}
          handleOpen={handleOpen}
          modalTitle="View reports"
          className="w-[63%]"
        >
          {data.reports.map((report, index) => (
            <div
              key={index}
              className="mb-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <p className="mb-2 flex justify-between gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {report.reportFrom}
                </span>
                <span>
                  {formatDate(report.date)}, {formatTime(report.date)}
                </span>
              </p>
              <p className="text-sm text-foreground">{report.comment}</p>
            </div>
          ))}
        </CommonModal>
      ) : null}
    </>
  );
};

export default FraudCheck;
