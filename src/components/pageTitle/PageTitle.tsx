const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
    </div>
  );
};

export default PageTitle;
