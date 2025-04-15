const ClientPage = ({ params }: { params: { clientID: string } }) => {
  const { clientID } = params;
  return <div>ClientID: {clientID}</div>;
};

export default ClientPage;
