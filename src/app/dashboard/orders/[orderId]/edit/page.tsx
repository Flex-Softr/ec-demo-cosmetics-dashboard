import EditOrderContent from "./components/EditOrderContent";

const EditOrderPage = async ({ params }: { params: { orderId: string } }) => {
  const orderId = params.orderId;
  return (
    <div>
      <EditOrderContent orderId={orderId} />
    </div>
  );
};

export default EditOrderPage;
