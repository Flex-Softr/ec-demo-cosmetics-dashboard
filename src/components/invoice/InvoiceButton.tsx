"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const InvoiceButton = () => {
  const handlePrint = () => {
    const printableArea = document.getElementById("printableArea");
    const printableContent = printableArea?.innerHTML;
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice-${Date.now()}</title>
                <style>
                    @media print {
                        .invoice-button {
                            display: none;
                        }
                    }
      
                    .invoice-button {
                        display: none;
                    }
      
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: var(--background);
                        color: var(--foreground);
                        box-sizing: border-box;
                    }
      
                    table {
                        text-align: start;
                        border-spacing: 0px;
                        white-space: normal;
                        font-variant: normal;
                    }
      
                    p {
                        margin: 0px;
                    }
      
                    .m-0 {
                        margin: 0px;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .px-5 {
                        padding-left: 1.25rem;
                        /* 20px */
                        padding-right: 1.25rem;
                        /* 20px */
                    }
                    .border-t-dashed {
                        border-top: 1px dashed #DDD;
                      }
                      .my-5 {
                          margin-top: 1.25rem/* 20px */;
                          margin-bottom: 1.25rem/* 20px */;
                      }
                      .my-10 {
                        margin-top: 41px ;
                        margin-bottom: 41px ;
                    }
                    .py-1 {
                        padding-top: 0.25rem/* 4px */;
                        padding-bottom: 0.25rem/* 4px */;
                    }
                    .pb-4 {
                        padding-bottom: 1rem
                            /* 16px */
                        ;
                    }
                    .pb2 {
                        padding-bottom: 2px;
                    }
                    .pt2 {
                        padding-top: 2px;
                    }
                    .text-center {
                        text-align: center;
                    }
      
                    .text-4xl {
                        font-size: 2.25rem;
                        /* 36px */
                        line-height: 2.5rem;
                        /* 40px */
                        margin-bottom: 0px;
                        margin-top: 0px;
                    }
      
                    .font-bold {
                        font-weight: 700;
                    }
      
                    .text-primary {
                        --tw-text-opacity: 1;
                        color: rgb(28 188 231 / var(--tw-text-opacity));
                    }
      
                    .w-28 {
                        width: 7rem;
                        /* 112px */
                    }
      
                    .mt-3 {
                        margin-top: 0.75rem
                            /* 12px */
                        ;
                    }
      
                    .mb-4 {
                        margin-bottom: 1rem;
                        /* 16px */
                    }
      
                    .font-semibold {
                        font-weight: 600;
                    }
      
                    .text-sm {
                        font-size: 0.875rem;
                        /* 14px */
                        line-height: 1.25rem;
                        /* 20px */
                        margin-bottom: 0px;
                        margin-top: 0px;
                    }
      
                    .gap-5 {
                        gap: 1.25rem;
                        /* 20px */
                    }
      
                    .flex {
                      display: flex;
                    }
                    
                    .flex-col {
                        flex-direction: column;
                    }
      
                    .justify-between {
                      justify-content: space-between;
                  }
      
                  .justify-start {
                      justify-content: flex-start;
                  }
      
                  .justify-center {
                      justify-content: center;
                  }
      
                  .items-center {
                      align-items: center;
                  }
                  .justify-end {
                    justify-content: flex-end;
                 }
                  .items-end {
                      align-items: flex-end;
                  }
      
                    .gap-1 {
                        gap: 0.25rem;
                        /* 4px */
                    }
      
                    .gap-2 {
                        gap: 0.5rem;
                        /* 8px */
                    }
      
                    .p-2 {
                        padding: 0.5rem
                            /* 8px */
                        ;
                    }
      
                    .w-4 {
                        width: 1rem;
                        /* 16px */
                    }
      
                    .address-width {
                        min-width: 89px;
                    }
      
                    .invoice-width {
                        min-width: 150px;
                    }
      
                    .space-y2> :not([hidden])~ :not([hidden]) {
                        --tw-space-y-reverse: 0;
                        margin-top: calc(2px * calc(1 - var(--tw-space-y-reverse)));
                        margin-bottom: calc(2px * var(--tw-space-y-reverse));
                    }
      
      
                    .text-white {
                        --tw-text-opacity: 1;
                        color: rgb(255 255 255 / var(--tw-text-opacity));
                    }
      
                    .text-right {
                        text-align: right;
                    }
      
      
                    .font-medium {
                        font-weight: 600;
                    }
      
                    .text-secondary {
                        color: #2B77C2;
                    }
      
                    .bg-secondary {
                        background-color: #2B77C2;
                    }
      
                    .text-xl {
                        font-size: 1.25rem;
                        /* 20px */
                        line-height: 1.75rem;
                        /* 28px */
                        margin-bottom: 0px;
                        margin-top: 0px;
                    }
      
                    .h-auto {
                        height: auto;
                    }
      
                    .mt-3 {
                        margin-top: 0.75rem;
                        /* 12px */
                    }
      
                    .mt-1 {
                        margin-top: 0.25rem;
                        /* 4px */
                    }
                    .mt2 {
                        margin-top: 2px;
                        /* 4px */
                    }
      
                    .w-20 {
                        width: 5rem;
                        /* 80px */
                    }
      
                    .px-2 {
                        padding-left: 0.5rem
                            /* 8px */
                        ;
                        padding-right: 0.5rem
                            /* 8px */
                        ;
                    }
      
                    .w-32 {
                        width: 8rem;
                        /* 128px */
                    }
      
                    .w-full {
                        width: 100%;
                    }
      
                    .overflow-auto {
                        overflow: auto;
                    }
      
                    .relative {
                        position: relative;
                    }
                    .border-b {
                        border-bottom: 1px solid #E5E5E5;
                    }
      
                    #tbl tr:nth-child(odd) {
                        background-color: #EDEBFB;
                    }
      
                    #tbl tr:nth-child(even) {
                        background-color: #E3EBF6;
                    }
      
                    #tbl th {
                        background-color: #2B77C2;
                    }
      
                    .bg-light {
                        background-color: #FAFAFA;
                    }
      
                    .h-10 {
                        height: 2.5rem
                            /* 40px */
                        ;
                    }
      
                    .text-left {
                        text-align: left;
                    }
      
                    .align-middle {
                        vertical-align: middle;
                    }
      
                    .lowercase {
                        text-transform: lowercase;
                    }
      
                    .capitalize {
                        text-transform: capitalize;
                    }
                </style>
            </head>
            <body>
                ${printableContent}
            </body>
            </html>
            `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="invoice-button">
      <Button onClick={handlePrint} className="flex items-center">
        <Printer className="w-4 mr-2" />
        <span>Invoice</span>
      </Button>
    </div>
  );
};

export default InvoiceButton;
